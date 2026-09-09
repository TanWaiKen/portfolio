"use client";
import { useEffect, useRef, useState } from 'react';
import { loadTrafficSummary } from '@/lib/analytics/client';

type Stage = 'waiting' | 'ready' | 'unavailable';
const labels = ['Preparing the painted canvas', 'Meeting the little guide', 'Setting the type', 'Hanging the 3D card', 'Gathering the latest traffic'];

export function PortfolioLoader() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [stages, setStages] = useState<Stage[]>(labels.map(() => 'waiting'));
  useEffect(() => {
    const surface = dialog.current;
    if (!surface) return;
    let cancelled = false;
    const settled = new Set<number>();
    const finish = () => { if (surface.open) surface.close(); };
    const done = (index: number, available = true) => {
      if (cancelled) return;
      settled.add(index);
      setStages(values => values.map((value, i) => i === index ? available ? 'ready' : 'unavailable' : value));
      if (settled.size === labels.length) requestAnimationFrame(() => requestAnimationFrame(() => { if (!cancelled) finish(); }));
    };
    // SSR already covers the first paint; upgrade the open dialog to modal.
    surface.close();
    surface.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const unlock = () => { if (!surface.open) document.body.style.overflow = oldOverflow; };
    surface.addEventListener('close', unlock);
    const image = (url: string, index: number) => {
      const asset = new Image();
      asset.src = url;
      asset.decode().then(() => done(index), () => done(index, false));
    };
    image('/art/landscape.webp', 0);
    image('/art/guide.webp', 1);
    document.fonts.ready.then(() => done(2));
    loadTrafficSummary().then(result => done(4, result.available));
    const card = document.querySelector('.lanyard-portrait');
    const inspect = () => {
      if (card?.getAttribute('data-ready') === 'true') done(3);
      else if (card?.querySelector('.lanyard-status button')) done(3, false);
    };
    const observer = new MutationObserver(inspect);
    if (card) observer.observe(card, { attributes: true, childList: true, subtree: true });
    inspect();
    // A slow or unsupported GPU must never lock visitors out of the portfolio.
    const deadline = window.setTimeout(finish, 6500);
    return () => { cancelled = true; clearTimeout(deadline); observer.disconnect(); surface.removeEventListener('close', unlock); finish(); unlock(); };
  }, []);
  const completed = stages.filter(stage => stage !== 'waiting').length;
  return <><noscript><style>{`.portfolio-loader { display: none !important; }`}</style></noscript><dialog open ref={dialog} className="portfolio-loader" aria-labelledby="loader-title">
    <div className="loader-paper">
      <span className="loader-signature" aria-hidden="true">k.</span>
      <p className="loader-label">A small moment before we begin</p>
      <h2 id="loader-title">Tan Wai Ken<span>Code, curiosity & a little colour.</span></h2>
      <div className="loader-progress" role="progressbar" aria-label="First-screen resources" aria-valuemin={0} aria-valuemax={labels.length} aria-valuenow={completed}><span style={{width: `${completed / labels.length * 100}%`}} /></div>
      <ul>{labels.map((label, index) => <li key={label} data-state={stages[index]}><span aria-hidden="true">{stages[index] === 'ready' ? '✓' : stages[index] === 'unavailable' ? '–' : '·'}</span>{label}</li>)}</ul>
      <button type="button" className="loader-enter" onClick={() => dialog.current?.close()}>Enter portfolio <span aria-hidden="true">↗</span></button>
      <p className="loader-note">You can enter while the remaining details load.</p>
    </div>
  </dialog></>;
}
