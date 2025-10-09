const fs = require('fs');
const { PDFParse } = require('pdf-parse');

const pdfPath = '/home/runner/workspace/Gardens-on-Quail-Interior_2025.pdf';

(async () => {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const parser = new PDFParse();
    const data = await parser.parse(dataBuffer);

    console.log(`Total pages: ${data.numpages}\n`);
    console.log('='.repeat(80));
    console.log('\nExtracted Text:\n');
    console.log(data.text);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
