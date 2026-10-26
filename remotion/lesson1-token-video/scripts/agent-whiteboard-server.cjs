const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),dataFile=path.join(root,'src/agent-whiteboard/course.json'),htmlFile=path.join(root,'public/agent-whiteboard/editor.html');
http.createServer(async(req,res)=>{
  res.setHeader('Cache-Control','no-store');
  if(req.method==='GET'&&req.url==='/renderer'){res.setHeader('Content-Type','text/html; charset=utf-8');fs.createReadStream(path.join(root,'public/agent-whiteboard/whiteboard-renderer.html')).pipe(res);return;}
  if(req.method==='GET'&&req.url==='/'){res.setHeader('Content-Type','text/html; charset=utf-8');res.end(fs.readFileSync(htmlFile,'utf8').replace(/(<script id="project" type="application\/json">)[\s\S]*?(<\/script>)/,(_,a,b)=>a+fs.readFileSync(dataFile,'utf8').replace(/</g,'\\u003c')+b));return;}
  if(req.method==='POST'&&req.url==='/api/project'){
    if(req.headers.origin!=='http://localhost:3175'&&req.headers.origin!=='http://127.0.0.1:3175'){res.writeHead(403);res.end('Origin rejected');return;}
    try{let body='';for await(const chunk of req){body+=chunk;if(body.length>32000000)throw Error('数据过大');}const d=JSON.parse(body);
      if(d.version!==1||d.fps!==30||d.width!==1920||d.height!==1080||d.scenes.length!==30||!d.scenes.every((s,i)=>s.id===`Scene-${String(i+1).padStart(2,'0')}`&&Array.isArray(s.elements)&&s.elements.length>0&&s.beatOf.length===s.elements.length&&Number.isInteger(s.durationInFrames)&&s.durationInFrames>0&&s.durationInFrames<=54000&&s.beats.every(b=>b.length===2&&b[0]>=0&&b[1]>b[0]&&b[1]<=s.durationInFrames/30)))throw Error('分镜数据无效');
      if(!fs.existsSync(dataFile+'.original'))fs.copyFileSync(dataFile,dataFile+'.original');
      fs.writeFileSync(dataFile+'.tmp',JSON.stringify(d,null,2)+'\n');fs.renameSync(dataFile+'.tmp',dataFile);res.end('ok');
    }catch(e){res.writeHead(400);res.end(e.message);}return;
  }res.writeHead(404);res.end('Not found');
}).listen(3175,'127.0.0.1',()=>console.log('白板编辑台 http://localhost:3175'));
