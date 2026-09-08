"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

type Mark = { x: number; y: number; born: number; angle: number; color: string; seed: number; length: number };

/** Decorative pigment only: never captures a pointer or prevents page scrolling. */
export function PaintedBackground() {
  const layer = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const surface = canvas.current;
    const backdrop = layer.current;
    const hero = document.getElementById("home");
    const main = document.getElementById("main");
    const ctx = surface?.getContext("2d");
    if (!surface || !ctx || !backdrop || !hero || !main) return;
    let marks: Mark[] = [];
    let frame = 0;
    let scrollFrame = 0;
    let lastStamp = 0;
    let held = false;
    let active = false;
    let previous: { x: number; y: number } | null = null;
    let gesture = 0;
    let pigment = "";
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const tokens = getComputedStyle(document.documentElement);
    const pigments = ["--paint-sage", "--paint-peach", "--paint-lilac"].map(name => tokens.getPropertyValue(name).trim());
    const clear = () => {
      held = false;
      marks = [];
      cancelAnimationFrame(frame);
      frame = 0;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      backdrop.dataset.marks = "0";
    };
    const sync = () => {
      scrollFrame = 0;
      const top = Math.max(0, Math.min(innerHeight, hero.getBoundingClientRect().bottom));
      const bottom = Math.max(0, innerHeight - main.getBoundingClientRect().bottom);
      backdrop.style.clipPath = `inset(${top}px 0 ${bottom}px)`;
      active = top < innerHeight && bottom < innerHeight && !document.hidden && !paused && !preference.matches;
      backdrop.dataset.running = String(active);
      if (!active) clear();
    };
    const scheduleSync = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(sync); };
    const resize = () => {
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      surface.width = Math.round(innerWidth * ratio);
      surface.height = Math.round(innerHeight * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      clear(); sync();
    };
    const draw = (now: number) => {
      frame = 0;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      marks = marks.filter(mark => now - mark.born < 2600);
      for (const mark of marks) {
        const age = (now - mark.born) / 2600;
        const fade = Math.min(1, (1 - age) * 2);
        const half = mark.length / 2;
        ctx.save();
        ctx.translate(mark.x, mark.y);
        ctx.rotate(mark.angle);
        ctx.globalAlpha = fade * .78;
        ctx.fillStyle = mark.color;
        // A single loaded palette-knife shape, with uneven ends and rounded pigment edges.
        ctx.beginPath();
        ctx.moveTo(-half, -13);
        ctx.bezierCurveTo(-half + 12, -27, half * .25, -25, half - 5, -17);
        ctx.lineTo(half + 5, -7);
        ctx.lineTo(half - 3, 3);
        ctx.lineTo(half + 2, 14);
        ctx.bezierCurveTo(half * .3, 24, -half + 9, 22, -half - 3, 11);
        ctx.closePath(); ctx.fill();
        ctx.save(); ctx.clip();
        // Broken, low-contrast relief follows the stroke instead of forming a white comb.
        for (let row = 0; row < 13; row++) {
          const noise = Math.sin(row * 7.13 + mark.seed);
          const y = row * 3.2 - 20;
          const start = -half + 4 + (noise + 1) * 12;
          const end = half - 5 - (Math.cos(row * 4.3) + 1) * 10;
          ctx.globalAlpha = fade * (row % 3 === 0 ? .16 : .09);
          ctx.strokeStyle = row % 3 === 0 ? tokens.getPropertyValue("--forest").trim() : tokens.getPropertyValue("--surface").trim();
          ctx.lineWidth = row % 3 === 0 ? 1 : 2.4;
          ctx.beginPath(); ctx.moveTo(start, y);
          ctx.bezierCurveTo(-half * .3, y - 3 + noise, half * .35, y + 4, end, y + noise * 2);
          ctx.stroke();
        }
        ctx.restore();
        ctx.restore();
      }
      backdrop.dataset.marks = String(marks.length);
      if (marks.length) frame = requestAnimationFrame(draw);
    };
    const stamp = (event: PointerEvent) => {
      if (!active || event.clientY < hero.getBoundingClientRect().bottom || event.clientY > main.getBoundingClientRect().bottom) return;
      if (!(event.target instanceof Element) || event.target.closest("h1,h2,h3,h4,p,a,button,input,textarea,select,summary,dialog,[role=dialog],.guide-widget")) return;
      const now = performance.now();
      if (now - lastStamp < 24) return;
      lastStamp = now;
      const dx = previous ? event.clientX - previous.x : 0;
      const dy = previous ? event.clientY - previous.y : 0;
      const distance = Math.hypot(dx, dy);
      if (previous && distance < 6) return;
      marks.push({ x: previous ? (previous.x + event.clientX) / 2 : event.clientX,
        y: previous ? (previous.y + event.clientY) / 2 : event.clientY,
        born: now, angle: previous ? Math.atan2(dy, dx) : -.35,
        color: pigment, seed: gesture * 13.7, length: previous ? Math.min(140, distance + 30) : 88 });
      previous = { x: event.clientX, y: event.clientY };
      if (marks.length > 28) marks.shift();
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const down = (event: PointerEvent) => {
      if (event.button !== 0 || !active || event.clientY < hero.getBoundingClientRect().bottom) return;
      if (!(event.target instanceof Element) || event.target.closest("h1,h2,h3,h4,p,a,button,input,textarea,select,summary,dialog,.about-copy,.profile-facts,.journey-grid,.featured-project,.project-card,.award-list,.guide-widget")) return;
      // Starting a brush stroke on bare paper should not select adjacent text.
      // Touch defaults stay intact, and presses within reading surfaces remain native.
      if (event.pointerType === "mouse") event.preventDefault();
      previous = null; gesture++; pigment = pigments[(gesture - 1) % pigments.length];
      held = true; stamp(event);
    };
    const move = (event: PointerEvent) => {
      // Touch gets a tap impression; swiping remains normal scrolling.
      if (held && event.buttons === 1 && event.pointerType !== "touch") stamp(event);
    };
    const up = () => { held = false; previous = null; };
    resize();
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", resize);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", sync);
    return () => {
      clear(); cancelAnimationFrame(scrollFrame);
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", sync);
    };
  }, [paused]);

  return <>
    <div ref={layer} className="painted-background" aria-hidden="true" data-running="false" data-marks="0">
      <div className="painted-drift" />
      <canvas ref={canvas} />
    </div>
    <div className="paint-controls section-wrap">
      <span>Built with purpose. <em>A little wonder.</em></span>
      <div><span className="paint-hint">Press the paper. Leave a little colour.</span>
        <button className="text-link" onClick={() => setPaused(value => !value)} disabled={reduced} aria-pressed={paused || reduced}>
          {paused || reduced ? <Play size={15} /> : <Pause size={15} />}
          {reduced ? "Reduced motion" : paused ? "Resume paint motion" : "Pause paint motion"}
        </button>
      </div>
    </div>
  </>;
}
