#!/usr/bin/env python3
"""Fix categories using JSON-LD breadcrumb schema from raw HTML."""
import json, re, subprocess, sys, time
from urllib.parse import urlparse

REPORT_IN = 'tools/reports/batch-authoring-report.json'

def fetch_html(url):
    try:
        r = subprocess.run(['curl', '-sk', '--max-time', '10', url], capture_output=True, text=True, timeout=15)
        return r.stdout
    except:
        return ''

def extract_category(html, url):
    # Method 1: JSON-LD breadcrumb (most reliable)
    for m in re.finditer(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', html, re.DOTALL):
        try:
            d = json.loads(m.group(1))
            bc = d.get('breadcrumb', {}) if isinstance(d, dict) else {}
            items = bc.get('itemListElement', [])
            if items:
                sorted_items = sorted(items, key=lambda x: int(x.get('position', 0)))
                names = [i.get('name', '') for i in sorted_items]
                # Last item is the product itself, second-to-last is the category
                if len(names) >= 3:
                    return f"Products, {names[-2]}"
                elif len(names) >= 2:
                    return f"Products, {names[-2]}"
        except:
            pass

    # Method 2: Microdata breadcrumb spans
    spans = re.findall(r'<span\s+itemprop="name">\s*(.*?)\s*</span>', html)
    seen = set()
    unique = []
    for s in spans:
        s = s.strip()
        if s and s not in seen and len(unique) < 6:
            seen.add(s)
            unique.append(s)
        elif s in seen and len(unique) > 2:
            break
    if len(unique) >= 3:
        return f"Products, {unique[-1]}"

    # Method 3: data-navcategory-pages attribute
    nav_cat = re.search(r'data-navcategory-pages="([^"]+)"', html)
    if nav_cat:
        return f"Products, {nav_cat.group(1)}"

    return None

def url_fallback(url):
    path = urlparse(url).path
    segs = path.strip('/').split('/')
    p_idx = segs.index('p') if 'p' in segs else -1
    if p_idx > 1:
        return 'Products, ' + ' '.join(w.capitalize() for w in segs[p_idx-1].split('-'))
    return 'Products'

def main():
    report = json.loads(open(REPORT_IN).read())
    print(f"\nFixing categories for {len(report)} pages via JSON-LD breadcrumbs...\n")

    scraped = fallbacks = 0

    for i, entry in enumerate(report):
        url = entry['sourceUrl']
        prog = f"[{i+1}/{len(report)}]"

        html = fetch_html(url)
        cat = extract_category(html, url) if html else None

        if cat:
            entry['category'] = cat
            scraped += 1
            print(f"{prog} ✅ {cat}")
        else:
            entry['category'] = url_fallback(url)
            fallbacks += 1
            print(f"{prog} ⚠️  Fallback: {entry['category']}")

        if i % 20 == 19:
            time.sleep(0.3)

    # Write reports
    with open('batch-authoring-report.json', 'w') as f:
        json.dump(report, f, indent=2)

    esc = lambda s: '"' + (s or '').replace('"', '""') + '"'
    hdr = 'Source URL,AEM Path,Status,Title,Description,Category,Canonical,Keywords,Image,Template,Brand'
    rows = [','.join([esc(r.get(k,'')) for k in ['sourceUrl','aemPath','status','title','description','category','canonical','keywords','image','template','brand']]) for r in report]
    with open('batch-authoring-report.csv', 'w') as f:
        f.write(hdr + '\n' + '\n'.join(rows))

    cats = {}
    for r in report:
        cats[r['category']] = cats.get(r['category'], 0) + 1

    print(f"\n{'='*55}")
    print(f"  JSON-LD scraped: {scraped}")
    print(f"  URL fallback:    {fallbacks}")
    print(f"{'='*55}\n")
    for k, v in sorted(cats.items(), key=lambda x: -x[1]):
        print(f"  {v:3d} - {k}")

if __name__ == '__main__':
    main()
