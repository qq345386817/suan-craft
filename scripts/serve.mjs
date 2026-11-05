import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
http.createServer((req,res)=>{
  const url = new URL(req.url,'http://localhost');
  const file = path.resolve(dist,'.'+decodeURIComponent(url.pathname));
  if(!file.startsWith(dist+path.sep) && file!==dist){res.writeHead(403);return res.end();}
  let target = file;
  if(fs.existsSync(target) && fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  const found = fs.existsSync(target) && fs.statSync(target).isFile();
  if(!found)target=path.join(dist,'404.html');
  res.writeHead(found?200:404,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(target).pipe(res);
}).listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:'+(process.env.PORT||4173)));
