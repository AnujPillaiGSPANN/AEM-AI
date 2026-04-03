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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/columns-info.js
  function parse(element, { document }) {
    const childDivs = Array.from(element.querySelectorAll(":scope > div"));
    if (childDivs.length < 4) return;
    const leftCol = document.createElement("div");
    if (childDivs[0]) {
      Array.from(childDivs[0].childNodes).forEach((node) => leftCol.appendChild(node.cloneNode(true)));
    }
    if (childDivs[2]) {
      Array.from(childDivs[2].childNodes).forEach((node) => leftCol.appendChild(node.cloneNode(true)));
    }
    const rightCol = document.createElement("div");
    if (childDivs[1]) {
      Array.from(childDivs[1].childNodes).forEach((node) => rightCol.appendChild(node.cloneNode(true)));
    }
    if (childDivs[3]) {
      Array.from(childDivs[3].childNodes).forEach((node) => {
        if (node.nodeName !== "FORM") {
          rightCol.appendChild(node.cloneNode(true));
        }
      });
    }
    const cells = [
      [leftCol, rightCol]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-info", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/form.js
  function parse2(element, { document }) {
    const frag1 = document.createDocumentFragment();
    frag1.appendChild(document.createComment(" field:reference "));
    const refLink = document.createElement("a");
    refLink.href = "/content/EMA_SAMPLE_PROJECT/forms/lorem-ipsum-generator";
    refLink.textContent = "/content/EMA_SAMPLE_PROJECT/forms/lorem-ipsum-generator";
    frag1.appendChild(refLink);
    const actionUrl = element.getAttribute("action") || "";
    let frag2;
    if (actionUrl) {
      frag2 = document.createDocumentFragment();
      frag2.appendChild(document.createComment(" field:action "));
      frag2.appendChild(document.createTextNode(actionUrl));
    }
    const cells = [
      [frag1],
      [frag2 || ""]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "form", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/lipsum-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".banner",
        "#lipsumcom_header",
        "#lipsumcom_left_siderail",
        "#lipsumcom_right_siderail",
        "#lipsumcom_incontent",
        "#lipsumcom_leaderboard_bottom",
        "#bannerL",
        "#bannerR",
        "ins.adsbygoogle",
        ".primisslate",
        ".fs-sticky-footer"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#Languages",
        "iframe",
        "link",
        "noscript"
      ]);
      const allBoxed = element.querySelectorAll(".boxed");
      if (allBoxed.length > 0) {
        const lastBoxed = allBoxed[allBoxed.length - 1];
        const hasEmail = lastBoxed.querySelector('a[href*="mailto:"]');
        const hasPrivacy = lastBoxed.querySelector('a[href*="privacy"]');
        if (hasEmail || hasPrivacy) {
          lastBoxed.remove();
        }
      }
      const pmLink = element.querySelector("#pmLink");
      if (pmLink) {
        const parent = pmLink.closest("div");
        if (parent) parent.remove();
      }
      element.querySelectorAll(".up-hide").forEach((el) => el.remove());
    }
  }

  // tools/importer/transformers/lipsum-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const template = payload && payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      const document = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        let sectionEl = null;
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
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

  // tools/importer/import-homepage.js
  if (typeof globalThis.process === "undefined") {
    globalThis.process = { cwd: () => "/", env: {}, version: "" };
  } else if (typeof globalThis.process.cwd !== "function") {
    globalThis.process.cwd = () => "/";
  }
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Lorem Ipsum homepage with content generation tool and reference information",
    urls: [
      "https://www.lipsum.com/"
    ],
    blocks: [
      {
        name: "columns-info",
        instances: ["#Panes"]
      },
      {
        name: "form",
        instances: ["#Panes form"]
      }
    ],
    sections: [
      {
        id: "hero",
        name: "Hero",
        selector: "#Inner",
        style: null,
        blocks: [],
        defaultContent: ["#Inner > h1", "#Inner > h4", "#Inner > h5"]
      },
      {
        id: "main-content",
        name: "Main Content",
        selector: "#Panes",
        style: null,
        blocks: ["columns-info", "form"],
        defaultContent: []
      },
      {
        id: "info-boxes",
        name: "Info Boxes",
        selector: ["#Content > .boxed", "#Packages"],
        style: null,
        blocks: [],
        defaultContent: ["#Content > .boxed"]
      },
      {
        id: "latin-reference",
        name: "Latin Reference",
        selector: "#Translation",
        style: null,
        blocks: [],
        defaultContent: ["#Translation > h3", "#Translation > p"]
      }
    ]
  };
  var parsers = {
    "columns-info": parse,
    "form": parse2
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
  var import_homepage_default = {
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
  return __toCommonJS(import_homepage_exports);
})();
