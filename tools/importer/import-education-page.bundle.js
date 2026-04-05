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

  // tools/importer/import-education-page.js
  var import_education_page_exports = {};
  __export(import_education_page_exports, {
    default: () => import_education_page_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    var _a;
    const frag0 = document.createDocumentFragment();
    frag0.appendChild(document.createComment(" field:image "));
    const video = element.querySelector("video");
    const bgImg = element.querySelector(".t3m-FlxBillboard-imageWrapper img");
    if (video) {
      const a = document.createElement("a");
      a.href = video.src || ((_a = video.querySelector("source")) == null ? void 0 : _a.src) || "";
      a.textContent = a.href;
      frag0.appendChild(a);
    } else if (bgImg) {
      const pic = bgImg.closest("picture") || bgImg;
      frag0.appendChild(pic.cloneNode(true));
    }
    const frag1 = document.createDocumentFragment();
    frag1.appendChild(document.createComment(" field:text "));
    const h1 = element.querySelector("h1");
    if (h1) frag1.appendChild(h1.cloneNode(true));
    const subtitle = element.querySelector(".t3m-FlxBillboard-content p");
    if (subtitle) frag1.appendChild(subtitle.cloneNode(true));
    const cells = [
      [frag0],
      [frag1]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-carousel.js
  function parse2(element, { document }) {
    let slides = element.querySelectorAll(":scope > swiper-slide");
    if (slides.length === 0) {
      slides = element.querySelectorAll('[class*="card"], [class*="Card"], figure, .t3m-ProductList-item');
    }
    if (slides.length === 0) {
      slides = element.querySelectorAll(":scope > *");
    }
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector("img");
      const titleEl = slide.querySelector('h3, h4, a[class*="font-bold"], [class*="title"]');
      const link = slide.querySelector("a[href]");
      const titleText = titleEl ? titleEl.textContent.trim() : "";
      const linkText = link ? link.textContent.trim() : "";
      if (!img && !titleText && !linkText) return;
      const frag0 = document.createDocumentFragment();
      frag0.appendChild(document.createComment(" field:image "));
      if (img) {
        const pic = img.closest("picture") || img;
        frag0.appendChild(pic.cloneNode(true));
      }
      const frag1 = document.createDocumentFragment();
      frag1.appendChild(document.createComment(" field:text "));
      if (titleText) {
        const h = document.createElement("h3");
        h.textContent = titleText;
        frag1.appendChild(h);
      }
      if (link && link.href) {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = linkText || "View details";
        frag1.appendChild(a);
      }
      cells.push([frag0, frag1]);
    });
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-carousel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/table.js
  function parse3(element, { document }) {
    const rows = element.querySelectorAll("tr");
    const cells = [];
    rows.forEach((row) => {
      const rowCells = [];
      row.querySelectorAll("th, td").forEach((cell) => {
        rowCells.push(cell.textContent.trim());
      });
      if (rowCells.length > 0) {
        cells.push(rowCells);
      }
    });
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "table", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/video.js
  function parse4(element, { document }) {
    var _a;
    const videoEl = element.querySelector("video");
    const source = videoEl ? videoEl.src || ((_a = videoEl.querySelector("source")) == null ? void 0 : _a.src) : "";
    if (!source) return;
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(" field:uri "));
    const a = document.createElement("a");
    a.href = source;
    a.textContent = source;
    frag.appendChild(a);
    const cells = [[frag]];
    const block = WebImporter.Blocks.createBlock(document, { name: "video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse5(element, { document }) {
    const col1El = element.querySelector('[class*="t3m-con-column-1"]');
    const col2El = element.querySelector('[class*="t3m-con-column-2"]');
    if (!col1El && !col2El) return;
    const col1 = document.createDocumentFragment();
    const col2 = document.createDocumentFragment();
    if (col1El) {
      Array.from(col1El.childNodes).forEach((node) => col1.appendChild(node.cloneNode(true)));
    }
    if (col2El) {
      Array.from(col2El.childNodes).forEach((node) => col2.appendChild(node.cloneNode(true)));
    }
    const cells = [[col1, col2]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/quote.js
  function parse6(element, { document }) {
    const quoteEl = element.querySelector(".t3m-Testimonial-quote");
    const citeEl = element.querySelector(".t3m-Testimonial-cite, cite");
    const frag0 = document.createDocumentFragment();
    frag0.appendChild(document.createComment(" field:quotation "));
    if (quoteEl) {
      const p = document.createElement("p");
      p.textContent = quoteEl.textContent.trim();
      frag0.appendChild(p);
    }
    const frag1 = document.createDocumentFragment();
    frag1.appendChild(document.createComment(" field:attribution "));
    if (citeEl) {
      const p = document.createElement("p");
      p.textContent = citeEl.textContent.trim();
      frag1.appendChild(p);
    }
    const cells = [
      [frag0],
      [frag1]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "quote", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/feature-list.js
  function parse7(element, { document }) {
    const items = element.querySelectorAll('.t3m-Accordion-item, [class*="Accordion-item"]');
    const cells = [];
    items.forEach((item) => {
      const trigger = item.querySelector(".t3m-Accordion-trigger, h3, h4, h5");
      const panel = item.querySelector('.t3m-Accordion-panel, [class*="Accordion-panel"]');
      const frag0 = document.createDocumentFragment();
      frag0.appendChild(document.createComment(" field:icon "));
      const num = trigger ? trigger.textContent.trim().match(/^\d+/) : null;
      frag0.appendChild(document.createTextNode(num ? num[0] : ""));
      const frag1 = document.createDocumentFragment();
      frag1.appendChild(document.createComment(" field:text "));
      const titleText = trigger ? trigger.textContent.trim().replace(/^\d+\s*/, "") : "";
      if (titleText) {
        const h = document.createElement("h4");
        h.textContent = titleText;
        frag1.appendChild(h);
      }
      if (panel) {
        const p = document.createElement("p");
        p.textContent = panel.textContent.trim().substring(0, 500);
        frag1.appendChild(p);
      }
      cells.push([frag0, frag1]);
    });
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "feature-list", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/gallery.js
  function parse8(element, { document }) {
    const images = element.querySelectorAll("img");
    const cells = [];
    images.forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!src || src.includes("data:image") || src.includes("google.com") || src.includes("clarity.ms")) return;
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(" field:image "));
      const pic = img.closest("picture") || img;
      frag.appendChild(pic.cloneNode(true));
      cells.push([frag]);
    });
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cta-banner.js
  function parse9(element, { document }) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(" field:text "));
    const h2 = element.querySelector("h2");
    if (h2) {
      const heading = document.createElement("h2");
      heading.textContent = h2.textContent.trim();
      frag.appendChild(heading);
    }
    const desc = element.querySelector("p:not(:empty)");
    if (desc && desc.textContent.trim()) {
      const p = document.createElement("p");
      p.textContent = desc.textContent.trim();
      frag.appendChild(p);
    }
    const links = element.querySelectorAll("a[href]");
    links.forEach((link) => {
      const text = link.textContent.trim();
      if (text && !text.includes("Scroll") && text.length > 1) {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = text;
        frag.appendChild(a);
      }
    });
    const cells = [[frag]];
    const block = WebImporter.Blocks.createBlock(document, { name: "cta-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/promo-banner.js
  function parse10(element, { document }) {
    const frag0 = document.createDocumentFragment();
    frag0.appendChild(document.createComment(" field:image "));
    const img = element.querySelector("img");
    if (img) {
      const pic = img.closest("picture") || img;
      frag0.appendChild(pic.cloneNode(true));
    }
    const frag1 = document.createDocumentFragment();
    frag1.appendChild(document.createComment(" field:text "));
    const link = element.querySelector("a[href]");
    if (link) {
      const a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.textContent.trim() || "Learn more";
      frag1.appendChild(a);
    }
    const cells = [
      [frag0],
      [frag1]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "promo-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/leica-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        ".t3m-Modal",
        '[id*="CybotCookiebot"]',
        '[class*="cookie"]',
        "#onetrust-consent-sdk"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "#t3m-Header--main",
        ".t3m-Header",
        ".t3m-MainNavigation",
        "#t3m-Modal--mobileNavigation",
        "#t3m-Modal--languageMenu"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer",
        '[role="contentinfo"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "link",
        "noscript",
        "script",
        '[class*="t3m-hide-for-print"]'
      ]);
      element.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src") || "";
        if (src.includes("google.com/pagead") || src.includes("clarity.ms") || src.includes("ads.linkedin.com") || src.includes("bat.bing.com") || src.includes("px.ads.linkedin") || src.startsWith("data:image/svg+xml")) {
          img.remove();
        }
      });
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-di-res-id");
        el.removeAttribute("data-di-rand");
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
      });
      const scrollTop = element.querySelector('a[href="#t3m-SiteWrapper"]');
      if (scrollTop) scrollTop.remove();
    }
  }

  // tools/importer/transformers/leica-sections.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook.afterTransform) {
      const template = payload && payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      const document = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        let sectionEl = null;
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        for (const sel of selectors) {
          try {
            sectionEl = element.querySelector(sel);
          } catch (e) {
          }
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0 && sectionEl.previousElementSibling) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-education-page.js
  if (typeof globalThis.process === "undefined") {
    globalThis.process = { cwd: () => "/", env: {}, version: "" };
  } else if (typeof globalThis.process.cwd !== "function") {
    globalThis.process.cwd = () => "/";
  }
  var PAGE_TEMPLATE = {
    name: "education-page",
    description: "Leica Microsystems education page about educational microscopes",
    urls: [
      "https://www.leica-microsystems.com/applications/education/"
    ],
    blocks: [
      { name: "hero-banner", instances: [".t3m-FlxBillboard"] },
      { name: "cards-carousel", instances: ["swiper-container.m-slider"] },
      { name: "table", instances: ["table.t3m-Table"] },
      { name: "video", instances: [".t3m-Video"] },
      { name: "columns", instances: ["#c507724 [class*='t3m-con-gut']"] },
      { name: "quote", instances: [".t3m-Testimonial"] },
      { name: "feature-list", instances: ["#c507799"] },
      { name: "gallery", instances: ["#c438873"] },
      { name: "cta-banner", instances: ["#t3m-Section--ctaHub"] },
      { name: "promo-banner", instances: ["section.t3m-Section--bannerManager.t3m-bg-gray-300"] }
    ],
    sections: [
      { id: "billboard-hero", name: "Billboard Hero", selector: ".t3m-FlxBillboard", style: "dark", blocks: ["hero-banner", "cards-carousel"], defaultContent: [] },
      { id: "intro-text-image", name: "Delight Young Minds", selector: "#c438756", style: null, blocks: [], defaultContent: ["#c438756 h2", "#c438756 p", "#c438756 img"] },
      { id: "comparison-table", name: "Microscope Comparison Table", selector: "#c438764", style: null, blocks: ["table"], defaultContent: ["#c438764 h2", "#c438764 p"] },
      { id: "earth-sciences", name: "Earth Sciences Education", selector: "#c506734", style: "dark", blocks: [], defaultContent: ["#c506734 h2", "#c506734 p", "#c506734 img"] },
      { id: "forensic-science", name: "Forensic Science Education", selector: "#c506818", style: "dark", blocks: [], defaultContent: ["#c506818 h2", "#c506818 p", "#c506818 img"] },
      { id: "life-science", name: "Life Science Education", selector: "#c507651", style: "dark", blocks: [], defaultContent: ["#c507651 h2", "#c507651 p", "#c507651 img"] },
      { id: "material-sciences", name: "Material Sciences Education", selector: "#c507687", style: "dark", blocks: [], defaultContent: ["#c507687 h2", "#c507687 p", "#c507687 img"] },
      { id: "wifi-education", name: "Wi-Fi Education Solutions", selector: "#c507724", style: "dark", blocks: ["video", "columns"], defaultContent: ["#c507724 h2", "#c507724 p"] },
      { id: "advantages", name: "Wi-Fi Advantages", selector: "#c507799", style: null, blocks: ["feature-list"], defaultContent: ["#c507799 h2"] },
      { id: "experience-dynamic", name: "Experience Dynamic in Class", selector: "#c507862", style: "light", blocks: [], defaultContent: ["#c507862 h2", "#c507862 p"] },
      { id: "share-discuss", name: "Share Discuss Compare", selector: "#c438873", style: "dark", blocks: ["gallery"], defaultContent: ["#c438873 h2"] },
      { id: "contact-cta", name: "Contact CTA", selector: "#t3m-Section--ctaHub", style: null, blocks: ["cta-banner"], defaultContent: [] },
      { id: "promo-banner-section", name: "Promotional Banner", selector: "section.t3m-Section--bannerManager.t3m-bg-gray-300", style: null, blocks: ["promo-banner"], defaultContent: [] },
      { id: "partner-logos", name: "Partner Logos", selector: ".t3m-SiteWrapper > div:last-child", style: null, blocks: ["logo-bar"], defaultContent: [] }
    ]
  };
  var parsers = {
    "hero-banner": parse,
    "cards-carousel": parse2,
    "table": parse3,
    "video": parse4,
    "columns": parse5,
    "quote": parse6,
    "feature-list": parse7,
    "gallery": parse8,
    "cta-banner": parse9,
    "promo-banner": parse10
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
              section: blockDef.section || null
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
  var import_education_page_default = {
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
  return __toCommonJS(import_education_page_exports);
})();
