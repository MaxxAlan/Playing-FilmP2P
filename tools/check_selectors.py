import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
html_files = list(ROOT.glob('*.html'))
js_files = list((ROOT / 'assets' / 'js').glob('*.js'))

# Collect IDs and classes from HTML
id_map = {}
class_map = {}
for html in html_files:
    text = html.read_text(encoding='utf-8')
    ids = re.findall(r'id\s*=\s*"([^"]+)"', text)
    classes = re.findall(r'class\s*=\s*"([^"]+)"', text)
    id_map[html.name] = set(ids)
    cls = set()
    for c in classes:
        for part in c.split():
            cls.add(part)
    class_map[html.name] = cls

# Extract selectors from JS: getElementById, querySelector('#id'), querySelector('.class')
pattern_id_get = re.compile(r"getElementById\(['\"]([a-zA-Z0-9_\-]+)['\"]\)")
pattern_qs_id = re.compile(r"querySelector\(['\"]#([a-zA-Z0-9_\-]+)['\"]\)")
pattern_qs_class = re.compile(r"querySelector\(['\"]\.([a-zA-Z0-9_\-]+)['\"]\)")
pattern_qsa = re.compile(r"querySelectorAll\(['\"]([#.][a-zA-Z0-9_\-]+)['\"]\)")

missing = []

def any_html_has_id(idname):
    for h,ids in id_map.items():
        if idname in ids:
            return True
    return False

def any_html_has_class(clsname):
    for h,clss in class_map.items():
        if clsname in clss:
            return True
    return False

for js in js_files:
    txt = js.read_text(encoding='utf-8')
    ids = set(pattern_id_get.findall(txt) + pattern_qs_id.findall(txt))
    classes = set(pattern_qs_class.findall(txt))
    qsa = set(pattern_qsa.findall(txt))

    for idname in ids:
        if not any_html_has_id(idname):
            missing.append((js.name, 'id', idname))
    for clsname in classes:
        if not any_html_has_class(clsname):
            missing.append((js.name, 'class', clsname))
    for sel in qsa:
        selname = sel[1:]
        if sel.startswith('#'):
            if not any_html_has_id(selname):
                missing.append((js.name, 'id', selname))
        elif sel.startswith('.'):
            if not any_html_has_class(selname):
                missing.append((js.name, 'class', selname))

print('HTML files scanned:', len(html_files))
print('JS files scanned:', len(js_files))
print('\nSelectors referenced in JS but not found in any HTML:')
if missing:
    for jsfile, typ, name in missing:
        print(f'- {jsfile}: missing {typ} "{name}"')
else:
    print('None')
