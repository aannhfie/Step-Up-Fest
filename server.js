const http=require('http'),fs=require('fs'),path=require('path'),{WebSocketServer}=require('ws');
const KEY=process.env.HOST_KEY||'stepup',PORT=process.env.PORT||3000;
const html=fs.readFileSync(path.join(__dirname,'public','index.html'));
const srv=http.createServer((req,res)=>{
  if(req.url==='/healthz'){res.end('ok');return}
  res.writeHead(200,{'content-type':'text/html; charset=utf-8'});res.end(html);
});
const wss=new WebSocketServer({server:srv,path:'/ws'});
const store=new Map(),subs=new Set();
const parent=p=>p.slice(0,p.lastIndexOf('/'));
const out=(ws,o)=>{if(ws.readyState===1)ws.send(JSON.stringify(o))};
function snapFor(s){
  if(!s.col)return{t:'snap',sid:s.sid,doc:store.has(s.path)?store.get(s.path):null};
  const pre=s.path+'/',docs=[];
  for(const[k,v]of store)if(k.startsWith(pre)&&!k.slice(pre.length).includes('/'))docs.push([k.slice(pre.length),v]);
  return{t:'snap',sid:s.sid,docs};
}
wss.on('connection',ws=>{
  ws.host=false;
  ws.on('message',raw=>{
    let m;try{m=JSON.parse(raw)}catch(e){return}
    const rep=o=>out(ws,{id:m.id,...o});
    if(m.t==='auth'){ws.host=m.key===KEY;return rep({ok:ws.host})}
    if(m.t==='unsub'){for(const s of subs)if(s.ws===ws&&s.sid===m.sid)subs.delete(s);return}
    if(typeof m.path!=='string'||m.path.length>120||!/^[\w\/-]+$/.test(m.path))return rep({err:'bad'});
    if(m.t==='get')return rep({data:store.has(m.path)?store.get(m.path):null});
    if(m.t==='set'){
      if(m.path.startsWith('state/')&&!ws.host)return rep({err:'forbidden'});
      if(JSON.stringify(m.data).length>60000)return rep({err:'too big'});
      store.set(m.path,m.data);rep({ok:1});
      for(const s of subs)if(s.col?parent(m.path)===s.path:m.path===s.path)out(s.ws,snapFor(s));
      return;
    }
    if(m.t==='sub'){const s={ws,sid:m.sid,path:m.path,col:!!m.col};subs.add(s);out(ws,snapFor(s))}
  });
  ws.on('close',()=>{for(const s of subs)if(s.ws===ws)subs.delete(s)});
});
srv.listen(PORT,()=>console.log('Step Up Fest jalan di port '+PORT+' | kunci host: '+KEY));
