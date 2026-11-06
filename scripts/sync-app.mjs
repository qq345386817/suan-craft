import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appRoot = process.env.SUANCRAFT_APP_ROOT || path.resolve(root, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(appRoot, 'Sources/SuanCraftApp/Resources/Localizable.xcstrings')));
const languages = Object.keys(Object.values(catalog.strings)[0].localizations).sort();
for (const [key, entry] of Object.entries(catalog.strings)) {
  if (JSON.stringify(Object.keys(entry.localizations).sort()) !== JSON.stringify(languages)) throw Error(`App language drift: ${key}`);
}
const project = fs.readFileSync(path.join(appRoot, 'scripts/generate_project.py'), 'utf8');
const value = key => project.match(new RegExp(`'${key}'\\s*:\\s*'([^']+)'`))?.[1];
const snapshot = {
  name: 'SuanCraft', sourceLanguage: catalog.sourceLanguage, languages,
  version: value('MARKETING_VERSION'), build: project.match(/app_settings\['CURRENT_PROJECT_VERSION'\]='(\d+)'/)?.[1],
  minimumOS: { iOS: value('IPHONEOS_DEPLOYMENT_TARGET'), iPadOS: value('IPHONEOS_DEPLOYMENT_TARGET'), macOS: value('MACOSX_DEPLOYMENT_TARGET'), visionOS: value('XROS_DEPLOYMENT_TARGET') }
};
const gameKeys = {doubling:'game.title',carousel:'games.carousel.title',hundredReturn:'games.hundredReturn.title',equivalent:'games.equivalent.title'};
const formulas = {doubling:'123456789 × 2 × 2 × 2 + 9 = 987654321',carousel:'142857 → 285714 → … → 999999',hundredReturn:'5050 − 1 − 2 − … − 100 = 0',equivalent:'5 + 5 = 5 + 1 + 1 + 1 + 1 + 1 = 10'};
snapshot.games = Object.entries(gameKeys).map(([id,key]) => ({id,formula:formulas[id],titles:Object.fromEntries(languages.map(l=>[l,catalog.strings[key].localizations[l].stringUnit.value]))}));
const localeMap = {'en-US':'en-US','zh-Hans':'zh-Hans','zh-Hant':'zh-Hant',es:'es-ES',de:'de-DE',fr:'fr-FR',ko:'ko',ja:'ja',ms:'ms'};
const metadata = {source:'local-fastlane',published:false,platforms:{}};
for (const platform of ['ios','macos','visionos']) {
  metadata.platforms[platform] = Object.fromEntries(languages.map(l=>[l,Object.fromEntries(['name','subtitle','description','promotional_text'].map(field=>[field,fs.readFileSync(path.join(appRoot,'fastlane',`metadata_${platform}`,localeMap[l],`${field}.txt`),'utf8').trim()]))]));
}
const output = path.join(root, 'content/app.json');
const metadataOutput = path.join(root,'content/store-metadata.json');
if (process.argv.includes('--check')) {
  if (JSON.stringify(JSON.parse(fs.readFileSync(output))) !== JSON.stringify(snapshot)) throw Error('App manifest drift. Run npm run sync:app.');
  if (JSON.stringify(JSON.parse(fs.readFileSync(metadataOutput))) !== JSON.stringify(metadata)) throw Error('Store copy drift. Run npm run sync:app and review localized website copy.');
  console.log(`PASS website manifest matches App: ${languages.length} languages, source ${catalog.sourceLanguage}, ${snapshot.version} (${snapshot.build})`);
} else {
  fs.writeFileSync(output, JSON.stringify(snapshot, null, 2) + '\n');
  fs.writeFileSync(metadataOutput, JSON.stringify(metadata, null, 2) + '\n');
  console.log('Updated standalone App manifest');
}
