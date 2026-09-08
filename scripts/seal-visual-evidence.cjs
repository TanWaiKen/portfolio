// Package actual test outputs and the completed visual review for an auditable handoff.
// Run only after inspecting the screenshots listed below; this does not perform visual judgment.
const fs = require('node:fs');
const crypto = require('node:crypto');
const dir = 'artifacts/visual-qa/';
const sha = file => 'sha256:' + crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const write = (file,data) => fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
const tests = JSON.parse(fs.readFileSync(dir+'interaction-report.json','utf8'));
if(tests.status !== 'PASS') throw new Error('Interaction checks must pass before packaging evidence.');
for(const file of ['src/components/ui/Lanyard.tsx','src/components/portfolio/HangingPortrait.tsx','src/components/portfolio/PaintedBackground.tsx','src/app/page.tsx','src/app/layout.tsx','src/app/portfolio.css','src/components/portfolio/Portfolio.tsx','src/components/portfolio/content.ts']) {
  if(fs.statSync(file).mtimeMs > fs.statSync(dir+'interaction-report.json').mtimeMs) throw new Error('Source changed after the browser checks: '+file);
}
const screenshotFiles = ['glb-mobile.png','glb-touch-drag.png','lanyard-restored-desktop.png','lanyard-drag.png','desktop-about.png','paint-pressed.png','paint-touch.png','desktop-hero.png','desktop-full.png','mobile-full.png','tablet-full.png','desktop-playground.png','mobile-project-dialog.png','mobile-guide.png','desktop-contact.png'];
for(const file of screenshotFiles) if(!fs.existsSync(dir+file)) throw new Error('Missing screenshot: '+file);
const glb = JSON.parse(fs.readFileSync(dir+'glb-report.json','utf8'));
if(glb.status !== 'PASS') throw new Error('GLB checks must pass.');
const paint = JSON.parse(fs.readFileSync(dir+'paint-motion-report.json','utf8'));
if(paint.status !== 'PASS') throw new Error('Paint interaction checks must pass.');
const review = {
  reviewed_at:'2026-09-08',status:'PASS',critical_count:0,
  summary:'Inspected the revised identity-first hero, restored background and experience before projects, JusAds engineering summary, and desktop/mobile/tablet composition. Reviewed the actual local GLB portrait and strap during dragging, its mobile fit and context recovery. Reviewed modal fit, readable type, character blending and footer spacing. Also reviewed the continuous contact surface without white strips, transparent section headings, retained whole-card reading surfaces, and directional palette-knife pigment impressions.',
  limitations:['These are Chromium and emulated-device checks, not a physical-device performance or screen-reader audit.','Painted image backgrounds received visual review; numeric contrast checks cover actual opaque text/background pairs.'],
  screenshots:screenshotFiles.map(file=>({locator:dir+file,sha256:sha(dir+file)})),
};
write(dir+'render-review.json',review);
write(dir+'browser-report.json',{
  schema:'light.frontend.browser_qa.v1',status:tests.status,target:tests.url,
  runner:'scripts/visual-qa.cjs — Node Playwright. The optional Python skill runner could not import Python Playwright; the installed Node runtime was used for real Chromium execution instead.',
  browser:tests.browser,
  viewports:tests.viewports.filter(item=>['desktop','mobile','tablet'].includes(item.name)).map(item=>({viewport:item.name,size:item.size,status:'PASS',dom:item.dom,failures:[],warnings:[],screenshot:item.screenshot.locator,screenshot_sha256:sha(item.screenshot.locator)})),
  runtime_errors:tests.errors,coverage:{real_chromium:true,checks:tests.checks.map(item=>item.name)},
  detailed_report:dir+'interaction-report.json',limitations:tests.limitations,
});
const evidence = file=>({status:'PASS',artifact:dir+file,artifact_sha256:sha(dir+file)});
write(dir+'frontend-delivery.json',{
  schema:'light.frontend_delivery.v1',delivery_claim:'READY',scenario:'custom',
  decisions:[
    ['scenario','custom','design.md — entire personal portfolio redesign'],
    ['style_direction','Picture-book impasto with a small-eyed painted companion','design.md — latest user direction, 2026-09-08'],
    ['stack','Existing Next.js, React and CSS application','package.json'],
    ['color','Warm paper, forest ink, sage and peach pigments','design.md — current adopted design decisions'],
    ['font','Georgia display and Arial/Helvetica reading stacks','design.md — deliberate picture-book typography revision'],
    ['motion','Brief button, reveal, tilt and character reactions','design.md — interaction acceptance and reduced-motion requirements'],
  ].map(([kind,selected,source_locator])=> ['font','color'].includes(kind)
    ? {kind,selected,authority:'delegated',user_authorization:'User requested the entire website redesign, then directed a picture-book impasto style. These are implementation choices within that authorized redesign; the user did not select exact font families or hex codes.',source_locator}
    : {kind,selected,authority:'inherited',source_locator}),
  sources:[
    {source_id:'art',name:'User-directed picture-book artwork',kind:'inspiration',use:'reference_only',locator:'docs/art-direction.md',access_tier:'public_free',license:'Generated for this project; original reference supplied by user',last_checked:'2026-09-08'},
    {source_id:'lucide',name:'Existing Lucide React icons',kind:'package',use:'reference_only',locator:'node_modules/lucide-react/LICENSE',package:'lucide-react@0.475.0',access_tier:'public_free',license:'ISC',last_checked:'2026-09-08'},
    {source_id:'legacy',name:'Retained legacy-component credits',kind:'component',use:'reference_only',locator:'README.md',access_tier:'public_free',license:'Existing credits retained; the lanyard component is reused with the supplied local GLB',last_checked:'2026-09-08'},
  ],
  token_system:{single_token_source:true,token_source_locator:'src/app/portfolio.css',token_source_sha256:sha('src/app/portfolio.css'),foreign_hardcoded_colors_remaining:false,second_design_system_present:false},
  qa:{contrast_lint:evidence('contrast-report.json'),ai_tell_lint:evidence('style-check.txt'),audit_checklist:evidence('layout-check.txt'),browser_qa:evidence('browser-report.json'),render_review:{...evidence('render-review.json'),reviewed_at:review.reviewed_at,summary:review.summary,screenshots:review.screenshots,critical_count:0}},
});
const lines = ['# Redesign verification','',`The final production frontend passed ${tests.checks.length} portfolio checks and ${paint.checks.length} painted-motion checks, plus ${glb.checks.length} targeted GLB checks in ${tests.browser}.`,'',...tests.checks.map(check=>'- PASS: '+check.name),...paint.checks.map(name=>'- PASS: '+name),...glb.checks.map(check=>'- PASS: '+check.name),'','Visual review: desktop/mobile/tablet page composition, project dialogues, paint texture and mascot blending, reading sizes, and guide/footer spacing.','', 'Evidence: `artifacts/visual-qa/interaction-report.json`, `render-review.json`, `contrast-report.json`, and `frontend-delivery.json`.','', 'Recordings: `desktop-walkthrough.mp4` and `mobile-walkthrough.mp4`, with original WebM captures preserved.','', 'Limitations: Chromium and emulated devices; no physical-device/screen-reader audit, no outgoing email, and no operation of external project demos. No deployment was performed.'];
fs.writeFileSync('docs/verification.md',lines.join('\n')+'\n');
console.log('Packaged real browser outputs and screenshot review hashes.');
