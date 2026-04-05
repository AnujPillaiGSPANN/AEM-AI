/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Leica Microsystems section breaks and section-metadata.
 * Runs in afterTransform only. Uses payload.template.sections.
 * Section selectors use TYPO3 element IDs from captured DOM.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const template = payload && payload.template;
    if (!template || !template.sections || template.sections.length < 2) return;

    const sections = template.sections;
    const document = element.ownerDocument;

    // Process sections in reverse order to avoid position shifts
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      let sectionEl = null;

      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      for (const sel of selectors) {
        try {
          sectionEl = element.querySelector(sel);
        } catch (e) {
          // skip invalid selectors
        }
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

      // Add section break (hr) before section if not the first section
      if (i > 0 && sectionEl.previousElementSibling) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
