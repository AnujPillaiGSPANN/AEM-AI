#!/usr/bin/env python3
"""
Fix categories in batch report by scraping breadcrumb schema from raw HTML.
Uses curl (no JS rendering needed) — much faster than Playwright.
"""

import json, re, subprocess, sys, time
from urllib.parse import urlparse

REPORT_IN = 'tools/reports/batch-authoring-report.json'
REPORT_JSON = 'batch-authoring-report.json'
REPORT_CSV = 'batch-authoring-report.csv'

def fetch_html(url):
    """Fetch raw HTML via curl"""
    try:
        result = subprocess.run(
            ['curl', '-sk', '--max-time', '10', url],
            capture_output=True, text=True, timeout=15
        )
        return result.stdout
    except:
        return ''

def extract_breadcrumb(html):
    """Extract breadcrumb items from schema.org markup in HTML source"""
    # Find all ListItem blocks with position and name
    items = []

    # Pattern: find itemListElement blocks and extract position + name
    list_items = re.findall(
        r'itemprop="itemListElement".*?itemprop="name"[^>]*>\s*(.*?)\s*</span>.*?itemprop="position"\s*content="(\d+)"',
        html, re.DOTALL
    )

    if not list_items:
        # Try reverse order (position before name)
        list_items_rev = re.findall(
            r'itemprop="itemListElement".*?itemprop="position"\s*content="(\d+)".*?itemprop="name"[^>]*>\s*(.*?)\s*</span>',
            html, re.DOTALL
        )
        list_items = [(name, pos) for pos, name in list_items_rev]

    if not list_items:
        # Simpler fallback: just find span itemprop=name
        names = re.findall(r'<span\s+itemprop="name">\s*(.*?)\s*</span>', html)
        # Deduplicate while preserving order (some pages have multiple breadcrumb schemas)
        seen = set()
        unique = []
        for n in names:
            n = n.strip()
            if n and n not in seen and len(unique) < 6:  # max 6 levels, first breadcrumb only
                seen.add(n)
                unique.append(n)
            elif n in seen and len(unique) > 2:
                break  # Second breadcrumb schema starting
        return unique

    # Sort by position and return names
    sorted_items = sorted(list_items, key=lambda x: int(x[1]))
    return [item[0].strip() for item in sorted_items]

def get_category(breadcrumb_items):
    """Get category from breadcrumb: 'Products, [last item]'"""
    if not breadcrumb_items:
        return None

    # Filter out 'Home' and empty items
    items = [i for i in breadcrumb_items if i and i.lower() != 'home']

    if len(items) >= 2:
        # Last item is the parent category
        return f"Products, {items[-1]}"
    elif len(items) == 1:
        return f"Products, {items[0]}"

    return None

def url_fallback_category(url):
    """Derive category from URL path as fallback"""
    path = urlparse(url).path
    segments = path.strip('/').split('/')
    p_idx = segments.index('p') if 'p' in segments else -1
    if p_idx > 1:
        subcat = ' '.join(w.capitalize() for w in segments[p_idx - 1].split('-'))
        return f"Products, {subcat}"
    return "Products"

def main():
    report = json.loads(open(REPORT_IN).read())
    print(f"\nFixing categories for {len(report)} pages via raw HTML breadcrumbs...\n")

    scraped = 0
    fallbacks = 0

    for i, entry in enumerate(report):
        url = entry['sourceUrl']
        prog = f"[{i+1}/{len(report)}]"

        html = fetch_html(url)

        if html:
            bc_items = extract_breadcrumb(html)
            category = get_category(bc_items)

            if category:
                entry['category'] = category
                scraped += 1
                print(f"{prog} ✅ {category}  (bc: {' > '.join(bc_items)})")
            else:
                entry['category'] = url_fallback_category(url)
                fallbacks += 1
                print(f"{prog} ⚠️  Fallback: {entry['category']}")
        else:
            entry['category'] = url_fallback_category(url)
            fallbacks += 1
            print(f"{prog} ❌ Fetch failed, fallback: {entry['category']}")

        # Small delay every 20 requests
        if i % 20 == 19:
            time.sleep(0.5)

    # Write JSON
    with open(REPORT_JSON, 'w') as f:
        json.dump(report, f, indent=2)

    # Write CSV
    def esc(s):
        return '"' + (s or '').replace('"', '""') + '"'

    headers = 'Source URL,AEM Path,Status,Title,Description,Category,Canonical,Keywords,Image,Template,Brand'
    rows = []
    for r in report:
        rows.append(','.join([esc(r.get('sourceUrl','')), esc(r.get('aemPath','')), esc(r.get('status','')),
                              esc(r.get('title','')), esc(r.get('description','')), esc(r.get('category','')),
                              esc(r.get('canonical','')), esc(r.get('keywords','')), esc(r.get('image','')),
                              esc(r.get('template','')), esc(r.get('brand',''))]))

    with open(REPORT_CSV, 'w') as f:
        f.write(headers + '\n' + '\n'.join(rows))

    # Summary
    cats = {}
    for r in report:
        cats[r['category']] = cats.get(r['category'], 0) + 1

    print(f"\n{'='*55}")
    print(f"  Breadcrumb scraped: {scraped}")
    print(f"  URL fallback:      {fallbacks}")
    print(f"  Total:             {len(report)}")
    print(f"{'='*55}")
    print(f"\nCategory breakdown:")
    for k, v in sorted(cats.items(), key=lambda x: -x[1]):
        print(f"  {v:3d} - {k}")

if __name__ == '__main__':
    main()
