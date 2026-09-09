const {chromium}=require('C:/Users/tanwa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const base=process.env.QA_URL||'http://127.0.0.1:3000';
const dir='artifacts/visual-qa';
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Users/tanwa/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe',headless:true});
 try{
  for(const mode of ['slow','timeout','failed']){
   const context=await browser.newContext({viewport:{width:mode==='slow'?1440:390,height:900},recordVideo:{dir:dir+'/loading-fix-video'}});
   const page=await context.newPage();let count=0;const documents=[];
   page.on('request',r=>{if(r.isNavigationRequest() && r.frame()===page.mainFrame())documents.push(r.url());});
   await page.route('**/api/analytics/collect',r=>r.fulfill({status:204}));
   await page.route('**/api/analytics/summary',async r=>{count++;if(mode==='timeout'){await new Promise(resolve=>setTimeout(resolve,7000));await r.abort().catch(()=>{});return;}await new Promise(resolve=>setTimeout(resolve,mode==='slow'?3000:300));await r.fulfill({status:mode==='failed'?503:200,contentType:'application/json',body:JSON.stringify({available:mode!=='failed',data:{views:42,clicks:7,active:1,lastVisit:null,topLink:null,daily:[]}})});});
   await page.goto(base,{waitUntil:'domcontentloaded'});
   await page.locator('.portfolio-loader[open]').waitFor();
   if(mode==='slow'){
    await page.waitForTimeout(800);assert.ok(await page.locator('.portfolio-loader').evaluate(e=>e.open));
    await page.screenshot({path:dir+'/loading-fix-pending.png'});
   }
   await page.locator('.portfolio-loader[open]').waitFor({state:'hidden',timeout:12000});
   assert.equal(count,1,'shared first request');assert.equal(documents.length,1,'no navigation detour');
   if(mode==='slow')assert.equal(await page.locator('.traffic-grid strong').first().innerText(),'42');
   await page.waitForTimeout(400);assert.equal(await page.locator('.portfolio-loader').evaluate(e=>e.open),false,'does not reopen');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.screenshot({path:dir+`/loading-fix-${mode}.png`});
   await context.close();console.log('PASS '+mode+' startup, single request, no redirect/reopen');
  }
  const p=await browser.newPage();
  await p.route('**/_next/**/*.js',r=>r.abort());
  await p.goto(base,{waitUntil:'domcontentloaded'});
  assert.ok(await p.locator('.portfolio-loader').isVisible(),'SSR loader visible before hydration');
  await p.screenshot({path:dir+'/loading-fix-before-hydration.png'});await p.close();
  const nojs=await browser.newPage({javaScriptEnabled:false});await nojs.goto(base);assert.equal(await nojs.locator('.portfolio-loader').isVisible(),false);assert.ok(await nojs.locator('h1').isVisible());await nojs.close();
  console.log('PASS pre-hydration overlay and no-JavaScript access');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
