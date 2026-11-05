import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = JSON.parse(fs.readFileSync(path.join(root,'content/app.json')));
const expected = ['de','en-US','es','fr','ja','ko','ms','zh-Hans','zh-Hant'];
assert.deepEqual([...app.languages].sort(), expected);
assert.equal(app.sourceLanguage, 'en-US');
const source = JSON.parse(fs.readFileSync(path.join(root,'content/en-US.json')));
for (const locale of expected) {
  const copy = JSON.parse(fs.readFileSync(path.join(root,`content/${locale}.json`)));
  assert.deepEqual(Object.keys(copy).sort(),Object.keys(source).sort(),`${locale}: missing translation keys`);
  for (const [key,value] of Object.entries(copy)) assert.equal(typeof value === 'string' && value.trim().length > 0,true,`${locale}:${key}: empty copy`);
}
const dist = path.join(root,'dist');
const pages = [];
const walk = dir => { for (const entry of fs.readdirSync(dir,{withFileTypes:true})) { const p = path.join(dir,entry.name); if(entry.isDirectory())walk(p); else if(entry.name==='index.html')pages.push(p); } };
walk(dist);
assert.equal(pages.length,27);
for (const file of pages) {
  const html = fs.readFileSync(file,'utf8');
  const pathname = '/' + path.relative(dist,path.dirname(file)).replaceAll(path.sep,'/') + '/';
  const url = 'https://suan-craft.luopeike.com' + (pathname==='//'?'/':pathname);
  assert.ok(html.includes(`rel="canonical" href="${url}"`),`${file}: canonical`);
  assert.equal((html.match(/rel="alternate" hreflang=/g)||[]).length,10,`${file}: alternate links`);
  assert.ok(!/undefined|TODO|Lorem ipsum/.test(html),`${file}: unfinished copy`);
  assert.ok(!/apps\.apple\.com|testflight\.apple\.com\/join/.test(html),`${file}: unverified public download`);
  for (const match of html.matchAll(/(?:href|src)="([^"<>]+)"/g)) {
    const link = match[1].replaceAll('&amp;','&');
    if(!link.startsWith('/') && !link.startsWith('#')) continue;
    const target = new URL(link,url);
    if(target.origin!=='https://suan-craft.luopeike.com')continue;
    let targetFile = path.join(dist,decodeURIComponent(target.pathname));
    if(fs.existsSync(targetFile) && fs.statSync(targetFile).isDirectory())targetFile=path.join(targetFile,'index.html');
    assert.ok(fs.existsSync(targetFile),`${file}: broken internal link ${link}`);
    if(target.hash && targetFile.endsWith('.html')) assert.ok(fs.readFileSync(targetFile,'utf8').includes(`id="${decodeURIComponent(target.hash.slice(1))}"`),`${file}: missing anchor ${link}`);
  }
  const ld = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
  assert.equal(JSON.parse(ld[1]).url,url);
}
assert.equal((fs.readFileSync(path.join(dist,'sitemap.xml'),'utf8').match(/<loc>/g)||[]).length,27);
assert.ok(fs.readFileSync(path.join(dist,'_redirects'),'utf8').includes('https://suan-craft.pages.dev/* https://suan-craft.luopeike.com/:splat 301'));
assert.ok(fs.existsSync(path.join(dist,'404.html')));
console.log('PASS: 9 complete locales; 27 canonical pages; internal links, anchors, assets, metadata and deployment redirect.');
