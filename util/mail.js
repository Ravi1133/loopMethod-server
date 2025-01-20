const nodemailer =require("nodemailer")
const path =require("path")
async function sendEmailWithPDF(pdfPath, recipientEmail) {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service provider
        auth: {
            user: 'ravidwivedi135581133@gmail.com', // Replace with your email
            pass: 'cuao cizg zekd jsuc', // Replace with your password or app-specific password
        },
    });
    

    console.log("sending mail")
    const mailOptions = {
        from: 'ravidwivedi135581133@gmail.com',
        to: recipientEmail,
        subject: 'Event Ticket',
        text: 'Please find the Event Tickets. Thanks',
        attachments: [
            {
                filename: path.basename(pdfPath),
                path: pdfPath,
            },
        ],
    };

    return transporter.sendMail(mailOptions);
}
module.exports=sendEmailWithPDF
