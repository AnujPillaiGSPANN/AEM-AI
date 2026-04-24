/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: lipsum.com section breaks and section-metadata.
 * Selectors from captured DOM of https://www.lipsum.com/
 * Runs in afterTransform only. Uses payload.template.sections.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const template = payload && payload.template;
    if (!template || !template.sections || template.sections.length < 2) return;

    const sections = template.sections;
    const document = element.ownerDocument;

    // Process sections in reverse order to avoid offset issues
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];

      // Find the section element using selector(s)
      let sectionEl = null;
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) continue;

      // Add section-metadata block if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metaBlock);
      }

      // Add <hr> before section (except the first one) when there is content before it
      if (i > 0 && sectionEl.previousElementSibling) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
