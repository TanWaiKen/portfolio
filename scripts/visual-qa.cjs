/* Real-browser verification and recorded walkthroughs. No contact messages are sent. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const modules = process.env.CODEX_NODE_MODULES;
const { chromium } = require(modules ? path.join(modules, 'playwright') : 'playwright');
const url = process.env.QA_URL || 'http://127.0.0.1:3000';
const out = path.resolve('artifacts/visual-qa');
const result = { status: 'RUNNING', url, checks: [], viewports: [], errors: [], limitations: ['Chromium desktop and emulated touch devices; no physical-device or screen-reader audit.', 'External destinations are checked as links; no email is sent and project demos are not operated.'] };
fs.mkdirSync(out, { recursive: true });
function pass(name, detail = true) { result.checks.push({ name, status: 'PASS', detail }); console.log('PASS ' + name); }
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const wait = (page, ms = 650) => page.waitForTimeout(ms);
async function shot(page, file, fullPage = false) { await page.screenshot({ path: path.join(out, file), fullPage }); return { locator: 'artifacts/visual-qa/' + file, sha256: hash(path.join(out, file)) }; }
async function top(page, y, smooth = true) { await page.evaluate(({y,smooth}) => window.scrollTo({ top:y, behavior: smooth ? 'smooth' : 'instant' }), { y, smooth }); await wait(page); }
async function section(page, id) { await page.evaluate(id => document.getElementById(id).scrollIntoView({ behavior:'smooth', block:'start' }), id); await wait(page,900); }
async function tour(page, name) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  await top(page,0,false);
  for(let y=0; y<height; y+=Math.round(page.viewportSize().height*.72)) await top(page,y);
  await top(page,0,false);
  await wait(page,800);
  return shot(page, `${name}-full.png`,true);
}
async function audit(page,name) {
  const dom = await page.evaluate(() => {
    const visible = e => !!(e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden');
    const controls = [...document.querySelectorAll('a[href],button,summary')].filter(visible);
    const missingNames = controls.filter(e => !((e.getAttribute('aria-label') || e.textContent || '').trim())).map(e=>e.outerHTML.slice(0,150));
    const overflow = [...document.querySelectorAll('main *,header *,footer *')].filter(e => {
      const r=e.getBoundingClientRect();
      return visible(e) && r.width > 0 && (r.left < -1 || r.right > innerWidth+1) && getComputedStyle(e).position!=='absolute';
    }).map(e=>e.className).filter(Boolean);
    return { width:innerWidth, scrollWidth:document.documentElement.scrollWidth, height:document.documentElement.scrollHeight, missingNames, missingAlt:[...document.images].filter(i=>!i.hasAttribute('alt')).length, brokenImages:[...document.images].filter(i=>i.complete && i.naturalWidth===0).map(i=>i.src), overflow, headingSize:getComputedStyle(document.querySelector('#portfolio-heading')).fontSize };
  });
  assert.ok(dom.scrollWidth <= dom.width+1,`${name}: horizontal overflow ${dom.scrollWidth}/${dom.width}`);
  assert.deepEqual(dom.missingNames,[]); assert.equal(dom.missingAlt,0); assert.deepEqual(dom.brokenImages,[]);
  assert.ok(parseFloat(dom.headingSize)>=32,'Section heading reset regression');
  result.viewports.push({ name, size:page.viewportSize(), dom }); pass(`${name}: layout, headings, image loading and accessible names`,dom);
}
async function collectContrast(page) {
  const pairs = await page.evaluate(() => {
    const rgbToHex = rgb => { const n=rgb.match(/[\d.]+/g); return n ? '#'+n.slice(0,3).map(x=>Math.round(+x).toString(16).padStart(2,'0')).join('') : null; };
    const results=new Map();
    for (const e of document.querySelectorAll('main *,header *,footer *,aside *')) {
      if (!e.getClientRects().length || ![...e.childNodes].some(n=>n.nodeType===3 && n.textContent.trim())) continue;
      const style=getComputedStyle(e);
      if(style.visibility==='hidden') continue;
      let parent=e, bg=null, textured=false;
      while(parent) { const s=getComputedStyle(parent); if(s.backgroundImage!=='none') textured=true; const c=s.backgroundColor.match(/[\d.]+/g); if(c && (c.length<4 || +c[3]===1)) { bg=rgbToHex(s.backgroundColor); break; } parent=parent.parentElement; }
      if(!bg || textured || e.closest('.hero')) continue;
      const fg=rgbToHex(style.color); const role=parseFloat(style.fontSize)>=24 || (+style.fontWeight>=700 && parseFloat(style.fontSize)>=18.67) ? 'large' : 'body';
      const key=fg+bg+role;
      if(!results.has(key))results.set(key,{fg,bg,role,fg_name:(e.className || e.tagName).toString().slice(0,70),bg_name:bg});
    }
    results.set('focus',{fg:getComputedStyle(document.documentElement).getPropertyValue('--focus').trim(),bg:getComputedStyle(document.documentElement).getPropertyValue('--paper').trim(),role:'ui',fg_name:'keyboard focus',bg_name:'paper'});
    return [...results.values()];
  });
  fs.writeFileSync(path.join(out,'contrast-pairs.json'),JSON.stringify({ pairs, note:'Actual rendered opaque text/background pairs. Painted-image regions require visual review; decorative surface/surface pairs are not text contrast tests.' },null,2));
}
async function desktop(page) {
  await page.goto(url,{waitUntil:'networkidle',timeout:120000});
  assert.equal(await page.locator('h1').count(),1);
  assert.equal((await page.locator('h1').innerText()).trim(),'Tan Wai Ken.');
  assert.deepEqual(await page.locator('main > section').evaluateAll(nodes=>nodes.map(n=>n.id)),['home','about','journey','portfolio','recognition','playground','contact']);
  assert.equal(await page.locator('.hero-portrait img').count(),0);
  assert.ok((await page.locator('.lanyard-stage').getAttribute('aria-label')).includes('Tan Wai Ken'));
  assert.equal(await page.locator('.featured-source').getAttribute('href'),'https://github.com/TanWaiKen/JusAds');
  pass('Personal identity leads, background precedes projects, and JusAds links to its repository');
  await page.waitForSelector('.lanyard-portrait[data-ready="true"]', {timeout:60000});
  await wait(page,2000);
  await shot(page,'desktop-hero.png');
  assert.ok(await page.evaluate(()=>performance.getEntriesByType('resource').some(r=>r.name.endsWith('/card.glb'))));
  const stage=page.locator('.lanyard-stage canvas');
  const position=await stage.boundingBox();
  const before=await stage.screenshot();
  await page.mouse.move(position.x+position.width/2,position.y+position.height*.55);await page.mouse.down();
  await page.mouse.move(position.x+position.width/2+45,position.y+position.height*.5,{steps:12});
  assert.equal(await page.locator('.lanyard-portrait').getAttribute('data-dragging'),'true');
  await wait(page,250);
  assert.notDeepEqual(await stage.screenshot(),before);
  await shot(page,'lanyard-drag.png');await page.mouse.up();await wait(page,900);
  assert.equal(await page.locator('.lanyard-portrait').getAttribute('data-dragging'),'false');
  const settled=await stage.screenshot();
  await page.locator('.lanyard-flip').focus();await page.keyboard.press('Enter');await wait(page,180);
  assert.notDeepEqual(await stage.screenshot(),settled);
  assert.equal(await page.locator('.about-photo img').getAttribute('src'),'/ken_without_bg.JPG');
  assert.equal(await page.locator('.about-details .background-panel').count(),2);
  pass('Local GLB loads; 3D card drag/release and keyboard swing work; About photo and panels preserved');
  const cta=page.locator('.peek-action > a');
  const resting=await cta.evaluate(e=>getComputedStyle(e).transform);
  await cta.hover(); await wait(page,220);
  const hovering=await cta.evaluate(e=>getComputedStyle(e).transform);
  assert.notEqual(hovering,resting); await shot(page,'button-hover.png');
  await page.mouse.down(); await wait(page,200); const pressed=await cta.evaluate(e=>getComputedStyle(e).transform); assert.notEqual(pressed,hovering); await shot(page,'button-pressed.png');
  await page.mouse.move(20,80); await page.mouse.up(); pass('Raised button hover, press and mascot peek');
  await page.keyboard.press('Tab'); await page.locator('.header-contact').focus();
  const focus=await page.locator('.header-contact').evaluate(e=>({style:getComputedStyle(e).outlineStyle,width:getComputedStyle(e).outlineWidth})); assert.equal(focus.style,'solid'); pass('Visible keyboard focus ring',focus);
  await section(page,'portfolio');
  assert.equal(await page.locator('.featured-project,.project-card').count(),6);
  await page.getByRole('button',{name:'Applications 2',exact:true}).click();
  assert.equal(await page.locator('.project-card').count(),2); assert.equal(await page.locator('.featured-project').count(),0); await shot(page,'desktop-applications.png');
  await page.getByRole('button',{name:'AI & automation 4',exact:true}).click(); assert.equal(await page.locator('.featured-project,.project-card').count(),4);
  await page.getByRole('button',{name:'All work 6',exact:true}).click(); assert.equal(await page.locator('.featured-project,.project-card').count(),6); pass('All / applications / AI filters show the correct projects');
  const art=page.getByRole('button',{name:'Open JusAds project notes',exact:true}); await art.hover({position:{x:70,y:70}}); await wait(page,300);
  assert.notEqual(await art.evaluate(e=>getComputedStyle(e).transform),'none'); await shot(page,'artwork-tilt.png');
  await page.mouse.move(15,85); await wait(page,350); assert.equal(await art.evaluate(e=>getComputedStyle(e).transform),'none');
  await art.hover({position:{x:60,y:60}}); await wait(page,300); await page.evaluate(()=>window.dispatchEvent(new Event('blur'))); await wait(page,350); assert.equal(await art.evaluate(e=>getComputedStyle(e).transform),'none'); pass('Featured artwork responds to pointer and resets on exit and window blur');
  const labels=['JusAds','CrediSecure AI','iPocket','Invoice → Excel','Yumesession AI','VPet AI'];
  for(const label of labels) {
    const opener=page.getByRole('button',{name:`Open ${label} project notes`,exact:true}); await opener.click();
    const dialog=page.getByRole('dialog'); await dialog.waitFor({state:'visible'});
    assert.equal((await dialog.locator('h2').innerText()).trim(),label);
    assert.equal(await dialog.locator('.project-links a').count(),2);
    assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');
    if(label==='JusAds') { await shot(page,'desktop-project-dialog.png'); for(let i=0;i<8;i++){await page.keyboard.press('Tab'); assert.ok(await page.evaluate(()=>document.querySelector('dialog').contains(document.activeElement)),'Dialog focus escaped');} }
    await page.keyboard.press('Escape'); assert.equal(await dialog.isVisible(),false); assert.ok(await opener.evaluate(e=>e===document.activeElement));
  }
  pass('All six project dialogs, destinations, Escape, focus trap and focus restoration');
  await section(page,'about'); assert.equal(await page.locator('.about-layout').evaluate(e=>getComputedStyle(e).opacity),'1'); await shot(page,'desktop-about.png'); pass('Below-fold section reveal reaches visible state');
  await section(page,'journey'); const journey=page.locator('.journey-item').nth(1); await journey.locator('summary').click(); assert.equal(await journey.getAttribute('open'),''); await shot(page,'desktop-journey.png'); await journey.locator('summary').click(); assert.equal(await journey.getAttribute('open'),null); pass('Experience details expand and collapse');
  await section(page,'recognition'); await page.locator('.more-awards summary').click(); assert.equal(await page.locator('.recognition-section .award-row:visible').count(),11); await page.locator('.more-awards summary').click();
  await page.getByRole('button',{name:'Learning & certifications',exact:true}).click(); await page.locator('.more-awards summary').click(); assert.equal(await page.locator('.recognition-section .award-row:visible').count(),6); await page.locator('.more-awards summary').click(); await page.getByRole('button',{name:'Competitions',exact:true}).click(); pass('All 11 competition records and 6 certifications remain accessible');
  await section(page,'playground'); await page.getByRole('button',{name:'Say hello',exact:true}).click(); await wait(page,100); const moving=await page.locator('.character-figure').evaluate(e=>getComputedStyle(e).transform); assert.notEqual(moving,'none'); await shot(page,'character-wave.png'); await wait(page,800); assert.equal(await page.locator('.character-figure').evaluate(e=>getComputedStyle(e).transform),'none');
  await page.getByRole('button',{name:'Where should I start?',exact:false}).click(); assert.match(await page.locator('.guide-response').innerText(),/JusAds/); await wait(page,800); await shot(page,'desktop-playground.png');
  await page.getByRole('button',{name:'What does Ken do?',exact:false}).click(); assert.match(await page.locator('.guide-response').innerText(),/backend/); pass('Character reaction plays once, settles, and prepared responses update');
  await page.locator('.guide-launcher').click(); await shot(page,'desktop-guide.png'); await page.keyboard.press('Escape'); assert.equal(await page.locator('#guide-panel').count(),0);
  await page.locator('.guide-launcher').click(); await page.getByRole('button',{name:'Meet Ken',exact:false}).click(); assert.equal(await page.evaluate(()=>document.activeElement.id),'about-heading'); await wait(page,800);
  await page.locator('.guide-launcher').click(); await page.getByRole('button',{name:'Hide guide for this visit',exact:true}).click(); assert.equal(await page.locator('.guide-widget').count(),0); await page.reload({waitUntil:'networkidle'}); assert.equal(await page.locator('.guide-widget').count(),0);
  await section(page,'playground'); await page.getByRole('button',{name:'Open the little guide',exact:false}).click(); assert.equal(await page.locator('.guide-widget').count(),1); await page.keyboard.press('Escape'); pass('Guide navigation, Escape, session dismissal and restoration');
  await section(page,'contact'); await page.getByRole('button',{name:'Copy email address',exact:true}).click(); assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'tanwaiken552@gmail.com'); assert.match(await page.locator('.copy-status').innerText(),/copied/); await shot(page,'desktop-contact.png'); pass('Copy email works and announces success');
  assert.equal(await page.locator('.contact-cta').getAttribute('href'),'mailto:tanwaiken552@gmail.com');
  const pdf=await page.request.get(url+'/Tan_Wai_Ken_CV.pdf'); assert.equal(pdf.status(),200); assert.ok((await pdf.body()).subarray(0,4).toString()==='%PDF'); pass('Contact destination and real résumé PDF');
  await page.evaluate(()=>{ navigator.clipboard.writeText=async()=>{throw new Error('simulated clipboard rejection');}; });
  await wait(page,3100); await page.getByRole('button',{name:'Copy email address',exact:true}).click(); assert.match(await page.locator('.copy-status').innerText(),/manually/); pass('Clipboard rejection gives a usable manual fallback');
  await page.locator('.back-top').click(); await page.waitForFunction(()=>scrollY<10,null,{timeout:5000}); assert.equal(await page.locator('.desktop-nav [aria-current]').count(),0); pass('Footer back-to-top is unobstructed and clears section navigation state');
  const screenshot=await tour(page,'desktop'); await audit(page,'desktop'); result.viewports.at(-1).screenshot=screenshot;
  await collectContrast(page);
  const html=await page.content(); fs.writeFileSync(path.join(out,'rendered-desktop.html'),html);
}
async function mobile(page) {
  await page.goto(url,{waitUntil:'networkidle'}); await shot(page,'mobile-hero.png');
  await page.getByRole('button',{name:'Open navigation',exact:true}).click(); await shot(page,'mobile-navigation.png'); assert.equal(await page.locator('.mobile-nav a').count(),5);
  await page.locator('.mobile-nav').getByRole('link',{name:'Work',exact:false}).click(); await wait(page,900); assert.equal(await page.locator('.mobile-nav').count(),0); pass('Mobile navigation opens, navigates, and closes');
  await page.getByRole('button',{name:'Applications 2',exact:true}).tap(); await page.waitForFunction(()=>document.querySelectorAll('.project-card').length===2); assert.equal(await page.locator('.project-card').count(),2);
  await page.getByRole('button',{name:'Open iPocket project notes',exact:true}).tap(); await shot(page,'mobile-project-dialog.png'); await page.getByRole('button',{name:'Close project notes',exact:true}).tap(); await page.getByRole('button',{name:'All work 6',exact:true}).tap(); pass('Touch project filters and modal close');
  await section(page,'playground'); await page.getByRole('button',{name:'Where should I start?',exact:false}).tap(); await wait(page,800); await shot(page,'mobile-playground.png');
  await page.locator('.guide-launcher').tap(); await shot(page,'mobile-guide.png'); await page.getByRole('button',{name:'Get in touch',exact:false}).tap(); await wait(page,900); assert.equal(await page.evaluate(()=>document.activeElement.id),'contact-heading'); pass('Touch mascot prompts and guide shortcuts');
  const screenshot=await tour(page,'mobile'); await audit(page,'mobile'); result.viewports.at(-1).screenshot=screenshot;
}
async function main() {
  const browser=await chromium.launch({ headless:true, executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE });
  result.browser=browser.version();
  const contexts=[];
  try {
    for (const [name,size,isMobile] of [['desktop',{width:1440,height:900},false],['mobile',{width:390,height:844},true]]) {
      const context=await browser.newContext({viewport:size,isMobile,hasTouch:isMobile,deviceScaleFactor:1,permissions:['clipboard-read','clipboard-write'],recordVideo:{dir:out,size}}); contexts.push(context);
      const page=await context.newPage(); page.on('pageerror',e=>result.errors.push(e.message)); page.on('console',m=>{if(m.type()==='error')result.errors.push(m.text());});
      await (name==='desktop'?desktop(page):mobile(page));
      await context.close(); await page.video().saveAs(path.join(out,`${name}-walkthrough.webm`));
    }
    const tablet=await browser.newContext({viewport:{width:834,height:1112},hasTouch:true});contexts.push(tablet);
    const page=await tablet.newPage();await page.goto(url,{waitUntil:'networkidle'});const screenshot=await tour(page,'tablet');await audit(page,'tablet');result.viewports.at(-1).screenshot=screenshot;
    await page.setViewportSize({width:320,height:700});await top(page,0,false);await audit(page,'narrow-320');await shot(page,'narrow-320.png');await tablet.close();
    const reduced=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});contexts.push(reduced);const rp=await reduced.newPage();await rp.goto(url,{waitUntil:'networkidle'});await section(rp,'playground');await rp.getByRole('button',{name:'Say hello',exact:true}).click();assert.equal(await rp.locator('.character-figure').evaluate(e=>getComputedStyle(e).animationName),'none');assert.equal(await rp.locator('.character-figure').evaluate(e=>getComputedStyle(e).transform),'none');assert.equal(await rp.locator('.about-layout').evaluate(e=>getComputedStyle(e).opacity),'1');await shot(rp,'reduced-motion.png');pass('Reduced motion disables mascot movement and reveals all content');await reduced.close();
    const plain=await browser.newContext({viewport:{width:1280,height:900},javaScriptEnabled:false});contexts.push(plain);const pp=await plain.newPage();await pp.goto(url,{waitUntil:'networkidle'});assert.equal(await pp.locator('h1').count(),1);assert.equal(await pp.locator('.no-script-projects .project-links').count(),6);assert.equal(await pp.locator('.about-layout').evaluate(e=>getComputedStyle(e).opacity),'1');await shot(pp,'no-javascript.png');pass('Server-rendered content and all project destinations remain available without JavaScript');await plain.close();
    assert.deepEqual(result.errors,[]);pass('No browser runtime or console errors');result.status='PASS';
  } catch(error) {result.status='FAIL';result.errors.push(error.stack);console.error(error);process.exitCode=1;}
  finally { for(const context of contexts)await context.close().catch(()=>{});await browser.close();fs.writeFileSync(path.join(out,'interaction-report.json'),JSON.stringify(result,null,2));console.log('Report: artifacts/visual-qa/interaction-report.json'); }
}
main().catch(e=>{console.error(e);process.exitCode=1;});
