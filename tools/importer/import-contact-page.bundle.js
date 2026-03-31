var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-contact-page.js
  var import_contact_page_exports = {};
  __export(import_contact_page_exports, {
    default: () => import_contact_page_default
  });

  // tools/importer/parsers/cards-contact.js
  function parse(element, { document }) {
    const cardWrappers = element.querySelectorAll('[class*="t3m-con-column"]');
    const cells = [];
    cardWrappers.forEach((wrapper) => {
      const link = wrapper.querySelector("a");
      const icon = wrapper.querySelector('.rounded-full img, [class*="justify-center"] img');
      const heading = wrapper.querySelector("h3");
      const description = wrapper.querySelector("p");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (icon) {
        const img = document.createElement("img");
        img.src = icon.src || "";
        img.alt = heading ? heading.textContent.trim() : "";
        imageCell.appendChild(img);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (heading) {
        const h3 = document.createElement("h3");
        if (link) {
          const a = document.createElement("a");
          a.href = link.href || "";
          a.textContent = heading.textContent.trim();
          h3.appendChild(a);
        } else {
          h3.textContent = heading.textContent.trim();
        }
        textCell.appendChild(h3);
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        textCell.appendChild(p);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-contact",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed.js
  function parse2(element, { document }) {
    const a = document.createElement("a");
    const sourceUrl = "https://www.leica-microsystems.com/contact/contact-us-online/#t3m-PartnerMap";
    a.href = sourceUrl;
    a.textContent = sourceUrl;
    const cells = [[a]];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "embed",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/leica-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#t3m-Modal--closeContactFormConfirmation",
        // Contact form confirmation modal
        "#t3m-Modal--mobileNavigation",
        // Mobile nav overlay
        "#t3m-Modal--languageMenu",
        // Language selector modal
        ".t3m-Modal--slideDown",
        // Slide-down modals
        "#onetrust-consent-sdk",
        // OneTrust cookie consent banner
        "footer + div",
        // Danaher brands bar (must remove before footer)
        '[id^="batBeacon"]'
        // Bing tracking pixels
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#t3m-Header--main",
        // Main header with logo, nav, search
        "#dmf-element-1",
        // Online shop bar (Login, Cart, Quote Cart)
        "footer",
        // Site footer (Danaher logo, Company/Legal links, social)
        "nav",
        // All nav elements (main nav, breadcrumb, mobile nav)
        "#t3m-ToTop",
        // Scroll to top button
        "iframe",
        // Any iframes
        "link",
        // Link elements
        "noscript"
        // Noscript elements
      ]);
    }
  }

  // tools/importer/transformers/leica-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element };
      const doc = document || element.ownerDocument;
      const template = payload && payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = [...template.sections].reverse();
      sections.forEach((section, reverseIndex) => {
        const isFirst = reverseIndex === sections.length - 1;
        const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectorList) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) return;
        if (section.style) {
          const cells = { style: section.style };
          const metadataBlock = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells
          });
          sectionEl.after(metadataBlock);
        }
        if (!isFirst) {
          const hr = doc.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-contact-page.js
  var parsers = {
    "cards-contact": parse,
    "embed": parse2
  };
  var PAGE_TEMPLATE = {
    name: "contact-page",
    urls: [
      "https://www.leica-microsystems.com/contact/contact-us-online/"
    ],
    description: "Contact us online page with contact category cards and local office finder",
    blocks: [
      {
        name: "cards-contact",
        instances: ["#t3m-Section--ctaHub .grid"]
      },
      {
        name: "embed",
        instances: ["#t3m-PartnerMap"]
      }
    ],
    sections: [
      {
        id: "contact-cards",
        name: "Contact Category Cards",
        selector: "#t3m-Section--ctaHub",
        style: "dark",
        blocks: ["cards-contact"],
        defaultContent: []
      },
      {
        id: "local-contact",
        name: "Local Contact Finder",
        selector: "#c561242",
        style: null,
        blocks: ["embed"],
        defaultContent: ["#c561243 h2"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_contact_page_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_contact_page_exports);
})();
