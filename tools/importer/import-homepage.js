/* eslint-disable */
/* global WebImporter */

// Ensure process.cwd is available (required by WebImporter internals)
// Some pages with heavy ad scripts overwrite the process global
if (typeof globalThis.process === 'undefined') {
  globalThis.process = { cwd: () => '/', env: {}, version: '' };
} else if (typeof globalThis.process.cwd !== 'function') {
  globalThis.process.cwd = () => '/';
}

// PARSER IMPORTS
import columnsInfoParser from './parsers/columns-info.js';
import formParser from './parsers/form.js';

// TRANSFORMER IMPORTS
import lipsumCleanupTransformer from './transformers/lipsum-cleanup.js';
import lipsumSectionsTransformer from './transformers/lipsum-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Lorem Ipsum homepage with content generation tool and reference information',
  urls: [
    'https://www.lipsum.com/',
  ],
  blocks: [
    {
      name: 'columns-info',
      instances: ['#Panes'],
    },
    {
      name: 'form',
      instances: ['#Panes form'],
    },
  ],
  sections: [
    {
      id: 'hero',
      name: 'Hero',
      selector: '#Inner',
      style: null,
      blocks: [],
      defaultContent: ['#Inner > h1', '#Inner > h4', '#Inner > h5'],
    },
    {
      id: 'main-content',
      name: 'Main Content',
      selector: '#Panes',
      style: null,
      blocks: ['columns-info', 'form'],
      defaultContent: [],
    },
    {
      id: 'info-boxes',
      name: 'Info Boxes',
      selector: ['#Content > .boxed', '#Packages'],
      style: null,
      blocks: [],
      defaultContent: ['#Content > .boxed'],
    },
    {
      id: 'latin-reference',
      name: 'Latin Reference',
      selector: '#Translation',
      style: null,
      blocks: [],
      defaultContent: ['#Translation > h3', '#Translation > p'],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'columns-info': columnsInfoParser,
  'form': formParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  lipsumCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1
    ? [lipsumSectionsTransformer]
    : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
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

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
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
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
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
