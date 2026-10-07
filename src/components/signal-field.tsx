"use client";

import { useEffect, useRef, useState } from "react";

// A dot matrix where a slow noise field lights up sparse "signals" and the
// pointer sends a faint ripple through the grid. Decorative only: the CSS dot
// grid underneath is the fallback when WebGL is unavailable.

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform float uPointerOn;
uniform float uCell;
uniform float uScroll;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
  vec2 p = gl_FragCoord.xy;
  vec2 id = floor(p / uCell);
  vec2 local = fract(p / uCell) - 0.5;
  vec2 center = (id + 0.5) * uCell;

  float t = uTime;
  vec2 drift = vec2(t * 0.045, t * 0.03 - uScroll * 6.0);
  float n = noise(id * 0.075 + drift) * 0.65
          + noise(id * 0.21 - vec2(t * 0.02, t * 0.05)) * 0.35;
  float signal = smoothstep(0.7, 0.9, n) * step(0.4, hash(id));

  float d = distance(center, uPointer) / (uCell * 14.0);
  float ripple = uPointerOn * exp(-d * d * 2.2) * (0.55 + 0.45 * sin(d * 9.0 - t * 2.6));

  float energy = clamp(0.12 + signal * 0.9 + ripple * 0.55, 0.0, 1.0);
  float r = mix(0.06, 0.26, energy);
  float dotMask = 1.0 - smoothstep(r - 0.05, r + 0.02, length(local));

  vec3 base = vec3(0.925, 0.92, 0.9);
  vec3 accent = vec3(0.784, 0.961, 0.235);
  vec3 col = mix(base, accent, smoothstep(0.35, 1.0, signal + ripple * 0.4));
  float alpha = dotMask * mix(0.16, 0.95, energy) * (1.0 - clamp(uScroll, 0.0, 1.0) * 0.75);
  gl_FragColor = vec4(col * alpha, alpha);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

export function SignalField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [armed, setArmed] = useState(false);

  // Start the GPU work once the main thread is idle, after hydration.
  useEffect(() => {
    const idle = "requestIdleCallback" in window;
    const id = idle
      ? window.requestIdleCallback(() => setArmed(true), { timeout: 1500 })
      : window.setTimeout(() => setArmed(true), 300);
    return () => (idle ? window.cancelIdleCallback(id) : window.clearTimeout(id));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !armed) return;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uPointer = gl.getUniformLocation(prog, "uPointer");
    const uPointerOn = gl.getUniformLocation(prog, "uPointerOn");
    const uCell = gl.getUniformLocation(prog, "uCell");
    const uScroll = gl.getUniformLocation(prog, "uScroll");
    // Phones and touch devices: lower resolution and 30fps.
    const lowPower = window.matchMedia("(pointer: coarse), (max-width: 767px)").matches;
    let lastFrame = 0;
    let scroll = 0;
    const onScroll = () => {
      const h = canvas.getBoundingClientRect().height || 1;
      scroll = Math.min(1.5, window.scrollY / h);
      if (reduced.matches) draw(18);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let start = performance.now();
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, on: 0, target: 0 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.75);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (reduced.matches) draw(18);
    };

    const draw = (t: number) => {
      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;
      pointer.on += (pointer.target - pointer.on) * 0.06;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.uniform1f(uPointerOn, reduced.matches ? 0 : pointer.on);
      gl.uniform1f(uCell, 16 * dpr);
      gl.uniform1f(uScroll, scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      if (!lowPower || now - lastFrame > 32) {
        lastFrame = now;
        draw((now - start) / 1000 + 18);
      }
      raf = requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(raf);
      if (visible && !document.hidden && !reduced.matches) raf = requestAnimationFrame(loop);
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      pointer.tx = (e.clientX - rect.left) * dpr;
      pointer.ty = (rect.bottom - e.clientY) * dpr;
      pointer.target = 1;
      if (pointer.x < -9000) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
      }
    };
    const onLeave = () => (pointer.target = 0);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      play();
    });
    io.observe(canvas);
    const onVisibility = () => play();
    const onMotionChange = () => {
      start = performance.now();
      resize();
      play();
    };

    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", onMotionChange);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    resize();
    draw(18);
    play();
    setReady(true);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onMotionChange);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [armed]);

  return (
    <div aria-hidden="true" className={`dot-grid ${className}`}>
      <canvas
        ref={canvasRef}
        className="block size-full transition-opacity duration-1000"
        style={{ opacity: ready ? 1 : 0, background: ready ? "var(--bg)" : "transparent" }}
      />
    </div>
  );
}
