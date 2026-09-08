const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const dir = path.resolve('artifacts/visual-qa');
const reports = [];
function run(bin,args) {
  const result=spawnSync(bin,args,{encoding:'utf8'});
  if(result.status!==0)throw new Error(result.stderr || result.error || bin+' failed');
  return result.stdout;
}
for(const name of ['desktop','mobile']) {
  const file=path.join(dir,`${name}-walkthrough.mp4`);
  run('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',path.join(dir,`${name}-walkthrough.webm`),'-c:v','libx264','-preset','veryfast','-crf','22','-pix_fmt','yuv420p','-movflags','+faststart',file]);
  const metadata=JSON.parse(run('ffprobe',['-v','error','-show_entries','format=duration,size:stream=codec_name,width,height','-of','json',file]));
  const duration=Number(metadata.format.duration);
  if(duration<10 || !metadata.streams[0].width)throw new Error('Recording is unexpectedly short or invalid.');
  run('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',file,'-vf',`fps=1/${duration/9.1},scale=${name==='desktop'?480:240}:-1,tile=3x3`,'-frames:v','1',path.join(dir,`${name}-video-contact-sheet.png`)]);
  reports.push({name,file:`artifacts/visual-qa/${name}-walkthrough.mp4`,...metadata});
}
fs.writeFileSync(path.join(dir,'video-report.json'),JSON.stringify(reports,null,2)+'\n');
console.log(JSON.stringify(reports,null,2));
