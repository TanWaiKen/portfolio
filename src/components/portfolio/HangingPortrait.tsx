"use client";
import dynamic from 'next/dynamic';
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
const Lanyard = dynamic(() => import('../ui/Lanyard'), { ssr: false });
class CardBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}
export function HangingPortrait() {
  const figure = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const [lost, setLost] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [active, setActive] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [flipTrigger, setFlipTrigger] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const loaded = useCallback(() => setReady(true), []);
  const contextChanged = useCallback((value: boolean) => { setLost(value); setDragging(false); }, []);
  const retry = async () => {
    const { resetLanyardAssets } = await import('../ui/Lanyard');
    resetLanyardAssets();
    setReady(false); setFailed(false); setLost(false); setFlipTrigger(0); setFlipping(false); setAttempt(value => value + 1);
  };
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const motion = () => setReduced(query.matches);
    motion(); query.addEventListener('change', motion);
    let visible = true;
    const update = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    if (figure.current) observer.observe(figure.current);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); query.removeEventListener('change', motion); document.removeEventListener('visibilitychange', update); };
  }, []);
  return <figure ref={figure} className="hero-portrait lanyard-portrait" data-ready={ready && !lost && !failed} data-context-lost={lost} data-dragging={dragging} data-flipping={flipping}>
    <div className="lanyard-stage" role="group" aria-label="Interactive 3D hanging portrait of Tan Wai Ken. Drag the card to swing it.">
      <CardBoundary key={attempt} onError={() => { setFailed(true); setReady(false); }}><Lanyard active={active && !lost} reducedMotion={reduced} flipTrigger={flipTrigger} onReady={loaded} onDrag={setDragging} onFlipChange={setFlipping} onContextChange={contextChanged} /></CardBoundary>
      {(!ready || lost || failed) && <div className="lanyard-status" role="status">
        <span>{lost ? '3D rendering paused. Waiting for graphics recovery.' : failed ? 'The 3D card could not load.' : 'Loading 3D card…'}</span>
        {(lost || failed) && <button onClick={retry}>Reload 3D card</button>}
      </div>}
    </div>
    <figcaption>Tan Wai Ken<span>AI & Backend Engineer</span></figcaption>
    {ready && !lost && !failed && <button className="lanyard-flip" disabled={flipping || dragging} onClick={() => setFlipTrigger(value => value + 1)}>{flipping ? 'Flipping…' : 'Flip the card'} <span aria-hidden="true">↻</span></button>}
  </figure>;
}
