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
const output = path.join(root, 'content/app.json');
if (process.argv.includes('--check')) {
  if (JSON.stringify(JSON.parse(fs.readFileSync(output))) !== JSON.stringify(snapshot)) throw Error('App manifest drift. Run npm run sync:app.');
  console.log(`PASS website manifest matches App: ${languages.length} languages, source ${catalog.sourceLanguage}, ${snapshot.version} (${snapshot.build})`);
} else {
  fs.writeFileSync(output, JSON.stringify(snapshot, null, 2) + '\n');
  console.log('Updated standalone App manifest');
}
