/**
 * CamPass - Railway Concession Form Generator
 * Uses node-canvas to overlay blue text on SN99B template
 * then converts to PDF buffer
 *
 * Install: npm install canvas img2pdf
 * Place:   concession-template.png  →  backend/server/templates/
 */
const { createCanvas, loadImage } = require("canvas");
const path  = require("path");
const fs    = require("fs");

const TEMPLATE_PATH = path.join(__dirname, "../server/templates/concession-template.png");

// ── Exact same values that worked in our Python testing ─────────────────────
const BLUE  = "#3264ff";
const SHIFT = -18;

const COL_CLASS_START  = 134;
const COL_CLASS_END    = 270;
const COL_PERIOD_START = 270;
const COL_PERIOD_END   = 371;
const COL_FROM_START   = 371;
const COL_FROM_END     = 479;
const TABLE_ROW_Y      = 455;

// ── Helpers ──────────────────────────────────────────────────────────────────
function todayDDMMYYYY() {
  const d    = new Date();
  const dd   = String(d.getDate()).padStart(2, "0");
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const yy   = String(d.getFullYear()).slice(-2);  // 👈 .slice(-2) gives last 2 digits
  return `${dd}/${mm}/${yy}`;
}

function drawCentered(ctx, text, xStart, xEnd, y) {
  const colW      = xEnd - xStart;
  const textWidth = ctx.measureText(text).width;
  const x         = xStart + (colW - textWidth) / 2;
  ctx.fillText(text, x, y);
}

// ── Main ─────────────────────────────────────────────────────────────────────
/**
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.classVal
 * @param {string} data.period
 * @param {string} data.fromStation
 * @param {string} data.ageYears
 * @param {string} data.dob             DD/MM/YYYY
 * @param {string} data.prevCertNo
 * @param {string} data.lastTicketUpto
 * @param {string} data.seasonTicketNo
 * @returns {Promise<Buffer>}           PDF buffer
 */
async function generateConcessionPDF(data) {
  const today = todayDDMMYYYY();

  // Load template image onto canvas
  const templateImg = await loadImage(TEMPLATE_PATH);
  const canvas      = createCanvas(templateImg.width, templateImg.height);
  const ctx         = canvas.getContext("2d");

  // Draw blank template first
  ctx.drawImage(templateImg, 0, 0);

  // Set common text style
  ctx.fillStyle    = BLUE;
  ctx.textBaseline = "top";

  // ── LEFT SIDE ──────────────────────────────────────────────────────────────

  // Name — bold 20px, single line
  ctx.font = "bold 20px DejaVu Sans, Arial, sans-serif";
  ctx.fillText(data.name, 370, 275 + SHIFT);

  // Table cells — 18px, centered in each column
  ctx.font = "18px DejaVu Sans, Arial, sans-serif";
  drawCentered(ctx, data.classVal,    COL_CLASS_START,  COL_CLASS_END,  TABLE_ROW_Y + SHIFT);
  drawCentered(ctx, data.period,      COL_PERIOD_START, COL_PERIOD_END, TABLE_ROW_Y + SHIFT);
  drawCentered(ctx, data.fromStation, COL_FROM_START,   COL_FROM_END,   TABLE_ROW_Y + SHIFT);

  // Previous cert info — 22px
  ctx.font = "21px DejaVu Sans, Arial, sans-serif";
  ctx.fillText(data.prevCertNo,    465, 609  + SHIFT);
  ctx.fillText(data.lastTicketUpto, 479, 665  + SHIFT);
  ctx.fillText(today,               435, 1041 + SHIFT);

  // ── RIGHT SIDE ─────────────────────────────────────────────────────────────

  // Name in certificate — bold 20px
  ctx.font = "bold 20px DejaVu Sans, Arial, sans-serif";
  ctx.fillText(data.name, 895, 261 + SHIFT);

  // Age & DOB — 22px
  ctx.font = "22px DejaVu Sans, Arial, sans-serif";
  ctx.fillText(data.ageYears,        656,  313 + SHIFT);
  ctx.fillText(data.dob,             1596, 312 + SHIFT);

  // Right table row
  ctx.fillText(data.classVal,        685,  529 + SHIFT);
  ctx.fillText(data.period,          888,  529 + SHIFT);
  ctx.fillText(data.fromStation,     1111, 529 + SHIFT);

  // "Student at present holds" section
  ctx.fillText(data.classVal,        1128, 635 + SHIFT);
  ctx.fillText(data.seasonTicketNo,  1672, 634 + SHIFT);
  ctx.fillText(data.fromStation,     653,  663 + SHIFT);
  ctx.fillText(today,                1632, 664 + SHIFT);

  // Date row
  ctx.fillText(today, 756, 727 + SHIFT);

  // ── Export PNG buffer → convert to PDF ────────────────────────────────────
  const pngBuffer = canvas.toBuffer("image/png");

  // Use img2pdf (Python) via shell OR use pdfkit (Node)
  // We'll use pdfkit — lightweight, no Python needed
  const PDFDocument = require("pdfkit");

  return new Promise((resolve, reject) => {
    const doc    = new PDFDocument({ autoFirstPage: false });
    const chunks = [];

    doc.on("data",  chunk => chunks.push(chunk));
    doc.on("end",   ()    => resolve(Buffer.concat(chunks)));
    doc.on("error", err   => reject(err));

    // Add page sized to the image (landscape A3 fits 1920px wide form nicely)
    // 1920 x 1080 px at 96dpi = 20in x 11.25in
    // Convert px to pt (1 pt = 1/72 inch, 1 px at 96dpi = 0.75 pt)
    const ptW = templateImg.width  * 0.75;
    const ptH = templateImg.height * 0.75;

    doc.addPage({ size: [ptW, ptH], margin: 0 });
    doc.image(pngBuffer, 0, 0, { width: ptW, height: ptH });
    doc.end();
  });
}

module.exports = generateConcessionPDF;