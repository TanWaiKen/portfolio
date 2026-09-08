const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const {chromium}=require(path.join(process.env.CODEX_NODE_MODULES,'playwright'));
const out=path.resolve('artifacts/visual-qa');
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});
const context=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir:out,size:{width:1440,height:900}}});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
const checks=[];const check=name=>{checks.push(name);console.log('PASS '+name);};
try {
await page.goto('http://127.0.0.1:3000/',{waitUntil:'networkidle'});
const layer=page.locator('.painted-background');
await page.mouse.click(80,250);assert.equal(await layer.getAttribute('data-marks'),'0');check('Hero presses do not paint');
await page.locator('.paint-controls').scrollIntoViewIfNeeded();await page.evaluate(()=>window.scrollTo({top:document.getElementById('home').offsetHeight+100,behavior:'instant'}));await page.waitForTimeout(500);
assert.equal(await layer.getAttribute('data-running'),'true');
const before=await page.locator('.painted-drift').evaluate(e=>getComputedStyle(e).transform);await page.waitForTimeout(550);assert.notEqual(await page.locator('.painted-drift').evaluate(e=>getComputedStyle(e).transform),before);check('Paint texture drifts below the hero');
await page.mouse.move(75,330);await page.mouse.down();await page.mouse.move(115,490,{steps:12});await page.mouse.up();await page.waitForTimeout(100);
assert.ok(Number(await layer.getAttribute('data-marks'))>0);
assert.ok(await page.locator('.painted-background canvas').evaluate(c=>c.getContext('2d').getImageData(0,0,c.width,c.height).data.some((v,i)=>i%4===3&&v>0)));assert.equal(await page.evaluate(()=>getSelection().toString()),'');check('Press and drag draw real pigment pixels without selecting text');
await page.screenshot({path:path.join(out,'paint-pressed.png')});await page.waitForTimeout(2850);assert.equal(await layer.getAttribute('data-marks'),'0');check('Brush marks settle and clear');
await page.getByRole('button',{name:'Pause paint motion',exact:true}).click();assert.equal(await layer.getAttribute('data-running'),'false');
await page.waitForTimeout(150);
const paused=await page.locator('.painted-drift').evaluate(e=>getComputedStyle(e).transform);await page.waitForTimeout(350);assert.equal(await page.locator('.painted-drift').evaluate(e=>getComputedStyle(e).transform),paused);
await page.mouse.click(80,330);await page.waitForTimeout(100);assert.equal(await layer.getAttribute('data-marks'),'0');check('Pause freezes ambient paint and suppresses presses');
await page.getByRole('button',{name:'Resume paint motion',exact:true}).click();await page.evaluate(()=>window.scrollTo({top:document.getElementById('home').offsetHeight+100,behavior:'instant'}));await page.waitForTimeout(200);await page.mouse.click(75,330);await page.waitForTimeout(100);assert.ok(Number(await layer.getAttribute('data-marks'))>0);check('Resume restores paint');
await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);assert.equal(await layer.getAttribute('data-marks'),'0');assert.equal(await page.locator('.painted-drift').evaluate(e=>getComputedStyle(e).animationName),'none');assert.ok(await page.getByRole('button',{name:'Reduced motion',exact:true}).isDisabled());check('Live reduced-motion changes disable all paint motion');
await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(100);
await page.locator('.hero-socials a').first().focus(); // no outbound navigation
await page.locator('.header-contact').click();await page.waitForTimeout(700);assert.equal(await layer.getAttribute('data-marks'),'0');check('Links remain usable without brush reactions');
const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const mp=await mobile.newPage();await mp.goto('http://127.0.0.1:3000/',{waitUntil:'networkidle'});await mp.evaluate(()=>window.scrollTo({top:document.getElementById('about').offsetTop+100,behavior:'instant'}));await mp.waitForTimeout(300);await mp.touchscreen.tap(10,200);await mp.waitForTimeout(100);assert.ok(Number(await mp.locator('.painted-background').getAttribute('data-marks'))>0);await mp.screenshot({path:path.join(out,'paint-touch.png')});check('Touch tap leaves an impression without a pointer-blocking overlay');await mobile.close();
assert.deepEqual(errors,[]);
fs.writeFileSync(path.join(out,'paint-motion-report.json'),JSON.stringify({status:'PASS',checks,errors,limitations:['CSS texture motion and procedural brush impressions; not a physical fluid simulation.','Touch tested in Chromium emulation.']},null,2));
} finally {const video=page.video();await context.close();await video.saveAs(path.join(out,'paint-interaction.webm'));await video.delete();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
