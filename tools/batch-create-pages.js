#!/usr/bin/env node

/**
 * Batch AEM Page Creator
 * Creates metadata-only pages on AEM author instance from a list of URLs.
 * Scrapes metadata from each live page and creates JCR nodes via Sling POST.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { chromium } from 'playwright';

// ─── Configuration ───────────────────────────────────────────────
const TOKEN = process.argv[2];
const HOST = process.argv[3] || 'https://author-p24152-e1275188.adobeaemcloud.com';
const SITE_ROOT = process.argv[4] || '/content/EMA_SAMPLE_PROJECT/en';
const URL_FILE = process.argv[5] || 'tools/product-urls.txt';

if (!TOKEN) {
  console.error('Usage: node tools/batch-create-pages.js <TOKEN> [HOST] [SITE_ROOT] [URL_FILE]');
  process.exit(1);
}

// ─── Helpers ─────────────────────────────────────────────────────
async function post(path, params) {
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') body.append(k, v);
  }
  const res = await fetch(`${HOST}${path}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${TOKEN}` },
    body: body.toString(),
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return res.status;
}

function urlToAemPath(url) {
  const u = new URL(url);
  // Remove leading /products or /service and trailing slash
  let path = u.pathname.replace(/\/$/, '');
  // Keep full path structure: /products/light-microscopes/p/leica-lmd7 → same
  return `${SITE_ROOT}${path}`;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── Metadata Extraction ─────────────────────────────────────────
async function extractMetadata(page, url) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    return await page.evaluate(() => {
      const meta = {};

      // Title
      const ogTitle = document.querySelector('meta[property="og:title"]');
      meta.title = ogTitle ? ogTitle.content : document.title || '';

      // Description
      const desc = document.querySelector('meta[name="description"]');
      meta.description = desc ? desc.content : '';

      // Keywords
      const kw = document.querySelector('meta[name="keywords"]');
      meta.keywords = kw ? kw.content : '';

      // Canonical
      const canon = document.querySelector('link[rel="canonical"]');
      meta.canonical = canon ? canon.href : '';

      // OG Image
      const ogImg = document.querySelector('meta[property="og:image"]');
      meta.image = ogImg ? ogImg.content : '';

      // Breadcrumb - get last parent item for category
      const breadcrumbItems = document.querySelectorAll('[itemprop="itemListElement"]');
      const bcTexts = [];
      breadcrumbItems.forEach(item => {
        const name = item.querySelector('[itemprop="name"]');
        if (name) bcTexts.push(name.textContent.trim());
      });
      // Category = "Products, [Last Parent]" (second to last breadcrumb)
      if (bcTexts.length >= 3) {
        meta.category = `Products, ${bcTexts[bcTexts.length - 2]}`;
      } else if (bcTexts.length >= 2) {
        meta.category = `Products, ${bcTexts[bcTexts.length - 2]}`;
      } else {
        meta.category = 'Products';
      }

      // Brand - check if it's Leica Microsystems (leave empty)
      meta.brand = '';

      return meta;
    });
  } catch (err) {
    return { error: err.message, title: '', description: '', keywords: '', canonical: url, image: '', category: 'Products', brand: '' };
  }
}

// ─── Page Creation ───────────────────────────────────────────────
async function ensureParentPages(aemPath) {
  // Split path and create each level
  const parts = aemPath.split('/').filter(Boolean);
  let currentPath = '';

  for (let i = 0; i < parts.length - 1; i++) {
    currentPath += '/' + parts[i];
    // Skip the root content node
    if (currentPath === '/content' || currentPath === '/content/EMA_SAMPLE_PROJECT') continue;

    // Create page node (will 409 if exists, that's fine)
    await post(currentPath, { 'jcr:primaryType': 'cq:Page' });
    // Set minimal jcr:content
    const title = parts[i].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    await post(`${currentPath}/jcr:content`, {
      'jcr:primaryType': 'cq:PageContent',
      'sling:resourceType': 'core/franklin/components/page/v1/page',
      'cq:template': '/libs/core/franklin/templates/page',
      'jcr:title': title,
    });
  }
}

async function createPage(aemPath, metadata) {
  const results = {};

  // Ensure parent pages exist
  await ensureParentPages(aemPath);

  // Create page node
  results.page = await post(aemPath, { 'jcr:primaryType': 'cq:Page' });

  // Create jcr:content with metadata (or update if 409)
  results.jcrContent = await post(`${aemPath}/jcr:content`, {
    'jcr:primaryType': 'cq:PageContent',
    'sling:resourceType': 'core/franklin/components/page/v1/page',
    'cq:template': '/libs/core/franklin/templates/page',
    'jcr:title': metadata.title,
    'pageTitle': metadata.title,
    'jcr:description': metadata.description,
    'keywords': metadata.keywords,
    'canonical': metadata.canonical,
    'image': metadata.image,
    'category': metadata.category,
    'template': 'pdp',
  });

  // If 409 (already exists), update the existing node with properties
  if (results.jcrContent === 409) {
    results.jcrContent = await post(`${aemPath}/jcr:content`, {
      'sling:resourceType': 'core/franklin/components/page/v1/page',
      'cq:template': '/libs/core/franklin/templates/page',
      'jcr:title': metadata.title,
      'pageTitle': metadata.title,
      'jcr:description': metadata.description,
      'keywords': metadata.keywords,
      'canonical': metadata.canonical,
      'image': metadata.image,
      'category': metadata.category,
      'template': 'pdp',
    });
  }

  // Fix root resourceType
  await post(`${aemPath}/jcr:content/root`, {
    'sling:resourceType': 'core/franklin/components/root/v1/root',
  });

  // Create empty section (or fix resourceType if exists)
  results.section = await post(`${aemPath}/jcr:content/root/section`, {
    'jcr:primaryType': 'nt:unstructured',
    'sling:resourceType': 'core/franklin/components/section/v1/section',
  });
  if (results.section === 409) {
    results.section = await post(`${aemPath}/jcr:content/root/section`, {
      'sling:resourceType': 'core/franklin/components/section/v1/section',
    });
  }

  const success = results.jcrContent === 201 || results.jcrContent === 200;
  return { success, httpCodes: results };
}

// ─── Main ────────────────────────────────────────────────────────
async function main() {
  const urls = readFileSync(URL_FILE, 'utf-8')
    .split('\n')
    .map(u => u.trim())
    .filter(u => u.startsWith('http'));

  console.log(`\n${'='.repeat(60)}`);
  console.log(`  Batch AEM Page Creator`);
  console.log(`  URLs: ${urls.length}`);
  console.log(`  Host: ${HOST}`);
  console.log(`  Root: ${SITE_ROOT}`);
  console.log(`${'='.repeat(60)}\n`);

  // Launch browser for metadata scraping
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  // Suppress console noise
  page.on('console', () => {});
  page.on('pageerror', () => {});

  const report = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const aemPath = urlToAemPath(url);
    const progress = `[${i + 1}/${urls.length}]`;

    try {
      // Extract metadata
      const metadata = await extractMetadata(page, url);

      if (metadata.error) {
        console.log(`${progress} ⚠️  Metadata warning for ${url}: ${metadata.error}`);
      }

      // Create page
      const result = await createPage(aemPath, metadata);

      if (result.success) {
        successCount++;
        console.log(`${progress} ✅ ${aemPath}`);
      } else {
        failCount++;
        console.log(`${progress} ❌ ${aemPath} (HTTP: ${JSON.stringify(result.httpCodes)})`);
      }

      report.push({
        sourceUrl: url,
        aemPath,
        status: result.success ? 'Success' : 'Failed',
        httpCodes: result.httpCodes,
        title: metadata.title || '',
        description: (metadata.description || '').substring(0, 200),
        category: metadata.category || '',
        canonical: metadata.canonical || '',
        keywords: metadata.keywords || '',
        image: metadata.image || '',
        template: 'pdp',
        brand: metadata.brand || '',
      });

    } catch (err) {
      failCount++;
      console.log(`${progress} ❌ ${url} — Error: ${err.message}`);
      report.push({
        sourceUrl: url,
        aemPath,
        status: `Failed: ${err.message}`,
        title: '', description: '', category: '', canonical: '',
        keywords: '', image: '', template: 'pdp', brand: '',
      });
    }

    // Small delay to avoid overwhelming the server
    if (i % 10 === 9) await sleep(1000);
  }

  await browser.close();

  // ─── Generate Reports ────────────────────────────────────────
  mkdirSync('tools/reports', { recursive: true });

  // JSON report
  writeFileSync('tools/reports/batch-authoring-report.json', JSON.stringify(report, null, 2));

  // CSV report
  const csvHeaders = 'Source URL,AEM Path,Status,Title,Description,Category,Canonical,Keywords,Image,Template,Brand';
  const csvRows = report.map(r => {
    const esc = (s) => `"${(s || '').replace(/"/g, '""')}"`;
    return [esc(r.sourceUrl), esc(r.aemPath), esc(r.status), esc(r.title), esc(r.description), esc(r.category), esc(r.canonical), esc(r.keywords), esc(r.image), esc(r.template), esc(r.brand)].join(',');
  });
  writeFileSync('tools/reports/batch-authoring-report.csv', csvHeaders + '\n' + csvRows.join('\n'));

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  COMPLETE`);
  console.log(`  ✅ Success: ${successCount}`);
  console.log(`  ❌ Failed:  ${failCount}`);
  console.log(`  Total:     ${urls.length}`);
  console.log(`  Reports:   tools/reports/batch-authoring-report.json`);
  console.log(`             tools/reports/batch-authoring-report.csv`);
  console.log(`${'='.repeat(60)}\n`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
