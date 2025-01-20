const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const sendEmailWithPDF = require('./mail');

// Function to generate a PDF
async function generatePDF(qrCodesInfo, outputPath, sendTo) {
    try {
        // Resolve full path and ensure directory exists
        console.log(qrCodesInfo, outputPath, sendTo, "qrCodesInfo, outputPath, sendTo");
        const dirPath = path.resolve(__dirname, '../asset/ticketPdf');
        console.log(dirPath, "dirPath");

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        // Add the file name to the output path
        const filePath = path.join(dirPath, `ticket_${Math.floor(10000 + Math.random() * 90000)}.pdf`);
        console.log(filePath, 'outputPath');

        const doc = new PDFDocument();
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // Add title
        doc.fontSize(18).text('QR Code Report', { align: 'center' }).moveDown(2);

        // Loop through the QR codes and add them to the PDF
        qrCodesInfo.forEach(({ imagePath, info }, index) => {

            let absoluteImagePath =fs.existsSync(imagePath)
            console.log("imagePath", imagePath, "isExist", fs.existsSync(imagePath));

            console.log("inside foreach", imagePath, "imagePath");

            if (fs.existsSync(imagePath)) {
                // Add QR code image
                doc.image(imagePath, { fit: [150, 150], align: 'center', valign: 'center' }).moveDown(6.5);
            } else {
                doc.fontSize(12).fillColor('red').text(`QR Code ${index + 1}: Image not found`, { align: 'center' }).moveDown(1.5);
            }

            // Add respective information
            doc.fontSize(12).fillColor('black').text(`QR Code ${index + 1}: ${info}`, { align: 'center' }).moveDown(2);
        });

        doc.end();

        // Wait for the PDF to finish writing
        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });

        console.log('PDF generated successfully:', filePath);
        sendEmailWithPDF(filePath, sendTo);
        qrCodesInfo.forEach(({ imagePath, info }, index) => {
            fs.unlinkSync(imagePath)
        })
        return filePath;
    } catch (err) {
        console.error('Error generating PDF:', err);
        throw err;
    }
}
const qrCodesInfo = [
    { imagePath: path.resolve(__dirname, './asset/qrcode_678ddfa54182d1b03bc22527_678c7f286beda161f4ba8cbe.png'), info: 'Information for QR 1' }
    // { imagePath: path.resolve(__dirname, './asset/qrcode_678c7fb06beda161f4ba8cd0_678c7f286beda161f4ba8cbe.png'), info: 'Information for QR 2' },
    // { imagePath: path.resolve(__dirname, './asset/qrcode_678c7fb06beda161f4ba8cd3_678c7f286beda161f4ba8cbe.png'), info: 'Information for QR 2' },
];

// console.log(__dirname,"__dirname")

// // let outPath="/ticketPdf"

// // generatePDF(qrCodesInfo,outPath,"ravidwivedi135581133@gmail.com")
const absoluteImagePath = path.resolve('/Users/a1/Desktop/projecInt/server/asset/qrcode_678df5363ee95afa528e94a9_678c7f286beda161f4ba8cbe.png');
console.log("Resolved Path:", absoluteImagePath);
console.log("Path exists:", fs.existsSync(absoluteImagePath));
module.exports = generatePDF;