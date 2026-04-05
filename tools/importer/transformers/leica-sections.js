/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Leica Microsystems section breaks and section metadata.
 * Runs in afterTransform only. Uses payload.template.sections from page-templates.json.
 * Selectors from captured DOM of https://www.leica-microsystems.com/contact/contact-us-online/
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element };
    const doc = document || element.ownerDocument;
    const template = payload && payload.template;
    if (!template || !template.sections || template.sections.length < 2) return;

    // Process sections in reverse order to avoid offset issues
    const sections = [...template.sections].reverse();

    sections.forEach((section, reverseIndex) => {
      const isFirst = reverseIndex === sections.length - 1; // First section in original order
      const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];

      let sectionEl = null;
      for (const sel of selectorList) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) return;

      // Add section-metadata block if section has a style
      if (section.style) {
        const cells = { style: section.style };
        const metadataBlock = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells,
        });
        sectionEl.after(metadataBlock);
      }

      // Add section break (hr) before each section except the first
      if (!isFirst) {
        const hr = doc.createElement('hr');
        sectionEl.before(hr);
      }
    });
  }
}
