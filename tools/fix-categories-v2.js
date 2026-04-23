import { readFileSync, writeFileSync } from 'fs';
import { chromium } from 'playwright';

const REPORT = 'tools/reports/batch-authoring-report.json';

async function main() {
  const report = JSON.parse(readFileSync(REPORT, 'utf-8'));
  console.log(`\nScraping breadcrumbs for ${report.length} pages (waiting for full render)...\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();
  page.on('console', () => {});
  page.on('pageerror', () => {});

  let fixed = 0;
  let fallback = 0;

  for (let i = 0; i < report.length; i++) {
    const entry = report[i];
    const url = entry.sourceUrl;
    const prog = `[${i + 1}/${report.length}]`;

    try {
      await page.goto(url, { waitUntil: 'load', timeout: 25000 });

      // Wait specifically for breadcrumb schema markup to appear
      try {
        await page.waitForSelector('[itemprop="itemListElement"]', { timeout: 5000 });
      } catch { /* breadcrumbs might not exist on some pages */ }

      const category = await page.evaluate(() => {
        const items = document.querySelectorAll('[itemprop="itemListElement"]');
        const names = [];
        items.forEach(item => {
          const name = item.querySelector('[itemprop="name"]');
          if (name) names.push(name.textContent.trim());
        });
        // Category = "Products, [second to last item]"
        if (names.length >= 3) {
          return 'Products, ' + names[names.length - 2];
        } else if (names.length === 2) {
          return 'Products, ' + names[names.length - 2];
        }
        return null; // failed
      });

      if (category) {
        entry.category = category;
        fixed++;
        console.log(`${prog} ✅ ${category}`);
      } else {
        // Fallback: derive from URL
        const segments = new URL(url).pathname.split('/').filter(Boolean);
        const pIdx = segments.indexOf('p');
        const subcat = pIdx > 1 ? segments[pIdx - 1].split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ') : 'Products';
        entry.category = 'Products, ' + subcat;
        fallback++;
        console.log(`${prog} ⚠️  Fallback: ${entry.category}`);
      }
    } catch (err) {
      fallback++;
      console.log(`${prog} ❌ ${err.message.substring(0, 50)}`);
    }

    if (i % 15 === 14) await new Promise(r => setTimeout(r, 500));
  }

  await browser.close();

  // Write reports
  writeFileSync('batch-authoring-report.json', JSON.stringify(report, null, 2));

  const hdr = 'Source URL,AEM Path,Status,Title,Description,Category,Canonical,Keywords,Image,Template,Brand';
  const esc = s => '"' + (s || '').replace(/"/g, '""') + '"';
  const rows = report.map(r => [esc(r.sourceUrl),esc(r.aemPath),esc(r.status),esc(r.title),esc(r.description),esc(r.category),esc(r.canonical),esc(r.keywords),esc(r.image),esc(r.template),esc(r.brand)].join(','));
  writeFileSync('batch-authoring-report.csv', hdr + '\n' + rows.join('\n'));

  // Breakdown
  const cats = {};
  report.forEach(r => { cats[r.category] = (cats[r.category] || 0) + 1; });
  console.log(`\n${'='.repeat(50)}`);
  console.log(`  Breadcrumb scraped: ${fixed}`);
  console.log(`  URL fallback: ${fallback}`);
  console.log(`${'='.repeat(50)}`);
  console.log('\nCategory breakdown:');
  Object.entries(cats).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(`  ${v} - ${k}`));
}

main().catch(e => { console.error(e); process.exit(1); });
