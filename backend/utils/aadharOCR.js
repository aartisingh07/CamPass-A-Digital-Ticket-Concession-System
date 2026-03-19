const Tesseract = require("tesseract.js");
const pdf = require("pdf-poppler");
const path = require("path");

async function extractAadharNumber(pdfPath) {
  try {

    const outputDir = path.dirname(pdfPath);

    const opts = {
      format: "png",
      out_dir: outputDir,
      out_prefix: "aadhaar_page",
      page: 1
    };

    await pdf.convert(pdfPath, opts);

    const imagePath = path.join(outputDir, "aadhaar_page-1.png");

    const { data: { text } } = await Tesseract.recognize(
      imagePath,
      "eng"
    );

    const match = text.match(/\d{4}\s?\d{4}\s?\d{4}/);

    if (match) {
      return match[0].replace(/\s/g, "");
    }

    return null;

  } catch (err) {
    console.error("OCR Error:", err);
    return null;
  }
}

module.exports = extractAadharNumber;