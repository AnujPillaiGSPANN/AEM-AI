#!/usr/bin/env node

/**
 * Fix categories in the batch authoring report by re-scraping breadcrumbs.
 * Only updates the report files — does NOT touch AEM pages.
 */

import { readFileSync, writeFileSync } from 'fs';
import { chromium } from 'playwright';

const REPORT_JSON = 'tools/reports/batch-authoring-report.json';
const REPORT_CSV = 'tools/reports/batch-authoring-report.csv';
const OUTPUT_JSON = 'batch-authoring-report.json';
const OUTPUT_CSV = 'batch-authoring-report.csv';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const report = JSON.parse(readFileSync(REPORT_JSON, 'utf-8'));

  console.log(`\nFixing categories for ${report.length} pages...\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();
  page.on('console', () => {});
  page.on('pageerror', () => {});

  let fixed = 0;

  for (let i = 0; i < report.length; i++) {
    const entry = report[i];
    const url = entry.sourceUrl;
    const progress = `[${i + 1}/${report.length}]`;

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1500);

      const category = await page.evaluate(() => {
        const items = document.querySelectorAll('[itemprop="itemListElement"]');
        const names = [];
        items.forEach(item => {
          const name = item.querySelector('[itemprop="name"]');
          if (name) names.push(name.textContent.trim());
        });
        // Last parent = second to last breadcrumb item
        if (names.length >= 3) {
          return `Products, ${names[names.length - 2]}`;
        } else if (names.length >= 2) {
          return `Products, ${names[names.length - 2]}`;
        }
        return 'Products';
      });

      if (category !== 'Products') {
        entry.category = category;
        fixed++;
        console.log(`${progress} ✅ ${category}`);
      } else {
        console.log(`${progress} ⚠️  Only "Products" found for ${url}`);
      }
    } catch (err) {
      console.log(`${progress} ❌ Error: ${err.message.substring(0, 60)}`);
    }

    if (i % 10 === 9) await sleep(500);
  }

  await browser.close();

  // Write updated JSON
  writeFileSync(OUTPUT_JSON, JSON.stringify(report, null, 2));

  // Write updated CSV
  const csvHeaders = 'Source URL,AEM Path,Status,Title,Description,Category,Canonical,Keywords,Image,Template,Brand';
  const csvRows = report.map(r => {
    const esc = (s) => `"${(s || '').replace(/"/g, '""')}"`;
    return [esc(r.sourceUrl), esc(r.aemPath), esc(r.status), esc(r.title), esc(r.description), esc(r.category), esc(r.canonical), esc(r.keywords), esc(r.image), esc(r.template), esc(r.brand)].join(',');
  });
  writeFileSync(OUTPUT_CSV, csvHeaders + '\n' + csvRows.join('\n'));

  console.log(`\n${'='.repeat(50)}`);
  console.log(`  Categories fixed: ${fixed}/${report.length}`);
  console.log(`  Updated: ${OUTPUT_JSON}`);
  console.log(`  Updated: ${OUTPUT_CSV}`);
  console.log(`${'='.repeat(50)}\n`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
