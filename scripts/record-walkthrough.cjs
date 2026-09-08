// Presentation recordings are separate from screenshot-taking so viewport resizing
// during a full-page screenshot never appears in the final video.
const path = require('node:path');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.CODEX_NODE_MODULES ? path.join(process.env.CODEX_NODE_MODULES,'playwright') : 'playwright');
const out=path.resolve('artifacts/visual-qa');
const url=process.env.QA_URL || 'http://127.0.0.1:3000';
async function main() {
  const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});
  const results=[];
  for(const [name,size,mobile] of [['desktop',{width:1440,height:900},false],['mobile',{width:390,height:844},true]]) {
    const context=await browser.newContext({viewport:size,isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1,recordVideo:{dir:out,size}});
    const page=await context.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
    await page.goto(url,{waitUntil:'networkidle'}); await page.waitForSelector('.lanyard-portrait[data-ready="true"]',{timeout:60000}); await page.waitForTimeout(2000);
    if(!mobile) {const badge=await page.locator('.lanyard-stage canvas').boundingBox();await page.mouse.move(badge.x+badge.width/2,badge.y+badge.height*.55);await page.mouse.down();await page.mouse.move(badge.x+badge.width/2+45,badge.y+badge.height*.5,{steps:10});await page.waitForTimeout(450);await page.mouse.up();await page.waitForTimeout(800);await page.locator('.peek-action > a').hover();await page.waitForTimeout(900);}
    else {await page.getByRole('button',{name:'Open navigation',exact:true}).click();await page.waitForTimeout(650);await page.getByRole('button',{name:'Close navigation',exact:true}).click();}
    await page.locator('.peek-action > a').click();await page.waitForTimeout(1400);
    await page.getByRole('button',{name:'Open JusAds project notes',exact:true}).click();await page.waitForTimeout(1300);
    await page.getByRole('button',{name:'Close project notes',exact:true}).click();await page.waitForTimeout(600);
    const end=await page.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
    // Traverse from the top so the introduction and experience are recorded too.
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.waitForTimeout(700);
    const start=0;
    for(let y=start; y<end; y+=Math.round(size.height*.52)) {
      await page.evaluate(y=>window.scrollTo({top:y,behavior:'smooth'}),y);await page.waitForTimeout(800);
    }
    await page.locator('.back-top').click();await page.waitForFunction(()=>scrollY<10,null,{timeout:5000});await page.waitForTimeout(650);
    await page.evaluate(()=>document.getElementById('playground').scrollIntoView({behavior:'smooth'}));await page.waitForTimeout(1400);
    // Parent opacity stays solid during entrance, preventing a white blending flash.
    assert.equal(await page.locator('.playground-layout').evaluate(e=>getComputedStyle(e).opacity),'1');
    await page.getByRole('button',{name:'Say hello',exact:true}).click();await page.waitForTimeout(950);
    await page.getByRole('button',{name:'Where should I start?',exact:false}).click();await page.waitForTimeout(1100);
    await page.locator('.guide-launcher').click();await page.waitForTimeout(850);
    await page.getByRole('button',{name:'Get in touch',exact:false}).click();await page.waitForTimeout(1400);
    await page.evaluate(()=>window.scrollTo({top:document.documentElement.scrollHeight,behavior:'smooth'}));await page.waitForTimeout(1400);
    assert.deepEqual(errors,[]);
    // No screenshot calls in this context: the final frame remains a normal viewport.
    const video=page.video();await context.close();await video.saveAs(path.join(out,`${name}-walkthrough.webm`));await video.delete();
    results.push({viewport:name,size,status:'PASS',full_page_traversed:true,character_entrance_opaque:true,errors});
  }
  await browser.close();fs.writeFileSync(path.join(out,'walkthrough-check.json'),JSON.stringify(results,null,2));
  console.log('Clean desktop and mobile walkthroughs recorded.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
