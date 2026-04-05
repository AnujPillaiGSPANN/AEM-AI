/* eslint-disable */
/* global WebImporter */

// Ensure process.cwd is available (required by WebImporter internals)
if (typeof globalThis.process === 'undefined') {
  globalThis.process = { cwd: () => '/', env: {}, version: '' };
} else if (typeof globalThis.process.cwd !== 'function') {
  globalThis.process.cwd = () => '/';
}

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import cardsCarouselParser from './parsers/cards-carousel.js';
import tableParser from './parsers/table.js';
import videoParser from './parsers/video.js';
import columnsParser from './parsers/columns.js';
import quoteParser from './parsers/quote.js';
import featureListParser from './parsers/feature-list.js';
import galleryParser from './parsers/gallery.js';
import ctaBannerParser from './parsers/cta-banner.js';
import promoBannerParser from './parsers/promo-banner.js';

// TRANSFORMER IMPORTS
import leicaCleanupTransformer from './transformers/leica-cleanup.js';
import leicaSectionsTransformer from './transformers/leica-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'education-page',
  description: 'Leica Microsystems education page about educational microscopes',
  urls: [
    'https://www.leica-microsystems.com/applications/education/',
  ],
  blocks: [
    { name: 'hero-banner', instances: ['.t3m-FlxBillboard'] },
    { name: 'cards-carousel', instances: ['swiper-container.m-slider'] },
    { name: 'table', instances: ['table.t3m-Table'] },
    { name: 'video', instances: ['.t3m-Video'] },
    { name: 'columns', instances: ["#c507724 [class*='t3m-con-gut']"] },
    { name: 'quote', instances: ['.t3m-Testimonial'] },
    { name: 'feature-list', instances: ['#c507799'] },
    { name: 'gallery', instances: ['#c438873'] },
    { name: 'cta-banner', instances: ['#t3m-Section--ctaHub'] },
    { name: 'promo-banner', instances: ['section.t3m-Section--bannerManager.t3m-bg-gray-300'] },
  ],
  sections: [
    { id: 'billboard-hero', name: 'Billboard Hero', selector: '.t3m-FlxBillboard', style: 'dark', blocks: ['hero-banner', 'cards-carousel'], defaultContent: [] },
    { id: 'intro-text-image', name: 'Delight Young Minds', selector: '#c438756', style: null, blocks: [], defaultContent: ['#c438756 h2', '#c438756 p', '#c438756 img'] },
    { id: 'comparison-table', name: 'Microscope Comparison Table', selector: '#c438764', style: null, blocks: ['table'], defaultContent: ['#c438764 h2', '#c438764 p'] },
    { id: 'earth-sciences', name: 'Earth Sciences Education', selector: '#c506734', style: 'dark', blocks: [], defaultContent: ['#c506734 h2', '#c506734 p', '#c506734 img'] },
    { id: 'forensic-science', name: 'Forensic Science Education', selector: '#c506818', style: 'dark', blocks: [], defaultContent: ['#c506818 h2', '#c506818 p', '#c506818 img'] },
    { id: 'life-science', name: 'Life Science Education', selector: '#c507651', style: 'dark', blocks: [], defaultContent: ['#c507651 h2', '#c507651 p', '#c507651 img'] },
    { id: 'material-sciences', name: 'Material Sciences Education', selector: '#c507687', style: 'dark', blocks: [], defaultContent: ['#c507687 h2', '#c507687 p', '#c507687 img'] },
    { id: 'wifi-education', name: 'Wi-Fi Education Solutions', selector: '#c507724', style: 'dark', blocks: ['video', 'columns'], defaultContent: ['#c507724 h2', '#c507724 p'] },
    { id: 'advantages', name: 'Wi-Fi Advantages', selector: '#c507799', style: null, blocks: ['feature-list'], defaultContent: ['#c507799 h2'] },
    { id: 'experience-dynamic', name: 'Experience Dynamic in Class', selector: '#c507862', style: 'light', blocks: [], defaultContent: ['#c507862 h2', '#c507862 p'] },
    { id: 'share-discuss', name: 'Share Discuss Compare', selector: '#c438873', style: 'dark', blocks: ['gallery'], defaultContent: ['#c438873 h2'] },
    { id: 'contact-cta', name: 'Contact CTA', selector: '#t3m-Section--ctaHub', style: null, blocks: ['cta-banner'], defaultContent: [] },
    { id: 'promo-banner-section', name: 'Promotional Banner', selector: 'section.t3m-Section--bannerManager.t3m-bg-gray-300', style: null, blocks: ['promo-banner'], defaultContent: [] },
    { id: 'partner-logos', name: 'Partner Logos', selector: '.t3m-SiteWrapper > div:last-child', style: null, blocks: ['logo-bar'], defaultContent: [] },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'cards-carousel': cardsCarouselParser,
  'table': tableParser,
  'video': videoParser,
  'columns': columnsParser,
  'quote': quoteParser,
  'feature-list': featureListParser,
  'gallery': galleryParser,
  'cta-banner': ctaBannerParser,
  'promo-banner': promoBannerParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  leicaCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1
    ? [leicaSectionsTransformer]
    : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      try {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null,
          });
        });
      } catch (e) {
        console.warn(`Invalid selector for block "${blockDef.name}": ${selector}`);
      }
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
