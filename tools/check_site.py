import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

html_files = list(ROOT.glob('*.html'))

missing_assets = []
duplicate_ids = {}
img_missing_alt = []

asset_pattern = re.compile(r'(?:src|href)\s*=\s*"([^"]+)"')
id_pattern = re.compile(r'id\s*=\s*"([^"]+)"')
img_pattern = re.compile(r'<img\b([^>]*)>', re.IGNORECASE)

for html in html_files:
    text = html.read_text(encoding='utf-8')
    # find assets
    for m in asset_pattern.finditer(text):
        path = m.group(1)
        if path.startswith('http') or path.startswith('//'):
            continue
        # normalize
        p = (ROOT / path).resolve()
        if not p.exists():
            missing_assets.append((html.name, path))
    # duplicate ids
    ids = id_pattern.findall(text)
    dups = {i for i in ids if ids.count(i) > 1}
    if dups:
        duplicate_ids[html.name] = list(dups)
    # images without alt
    for im in img_pattern.finditer(text):
        attrs = im.group(1)
        if 'alt=' not in attrs:
            # report
            img_missing_alt.append((html.name, im.group(0)[:120]))

print('HTML files scanned:', len(html_files))
print('\nMissing assets:')
if missing_assets:
    for f,p in missing_assets:
        print(f'- {f}: {p}')
else:
    print('None')

print('\nDuplicate IDs (per file):')
if duplicate_ids:
    for f,ids in duplicate_ids.items():
        print(f'- {f}: {ids}')
else:
    print('None')

print('\nImages without alt attribute:')
if img_missing_alt:
    for f,tag in img_missing_alt:
        print(f'- {f}: {tag}...')
else:
    print('None')

# Additional checks: look for console.error usages in JS
print('\nConsole.error occurrences in JS files:')
js_files = list((ROOT / 'assets' / 'js').glob('*.js'))
ce = []
for js in js_files:
    txt = js.read_text(encoding='utf-8')
    if 'console.error' in txt:
        ce.append(js.name)
if ce:
    for j in ce:
        print('- '+j)
else:
    print('None')

# exit with code 0
