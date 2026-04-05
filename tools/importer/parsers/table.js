/* eslint-disable */
/* global WebImporter */

/** Parser for table block. Source: https://www.leica-microsystems.com/applications/education/. Selector: table.t3m-Table */
export default function parse(element, { document }) {
  const rows = element.querySelectorAll('tr');
  const cells = [];

  rows.forEach((row) => {
    const rowCells = [];
    row.querySelectorAll('th, td').forEach((cell) => {
      rowCells.push(cell.textContent.trim());
    });
    if (rowCells.length > 0) {
      cells.push(rowCells);
    }
  });

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'table', cells });
  element.replaceWith(block);
}
