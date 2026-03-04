import { readFileSync, writeFileSync } from 'fs';

const type = process.argv[2];
if (!['patch', 'minor', 'major'].includes(type)) {
  console.error('Usage: node scripts/bump-version.mjs <patch|minor|major>');
  process.exit(1);
}

const path = 'packages/react-facebook/package.json';
const pkg = JSON.parse(readFileSync(path, 'utf8'));
const v = pkg.version.split('.').map(Number);

if (type === 'major') { v[0]++; v[1] = 0; v[2] = 0; }
else if (type === 'minor') { v[1]++; v[2] = 0; }
else { v[2]++; }

pkg.version = v.join('.');
writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
console.log(`v${pkg.version}`);
