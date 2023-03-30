const mailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const mailId = process.env.MAIL_ID;
const mailPass = process.env.EMAIL_PASS;

// Send and email to the user to reset there password
const sendEmail = asyncHandler(async (data, req, res) => {
    let transporter = mailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user:"", // generated ethereal user
            pass:"", // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"WEB MASTER"', // sender address
        to: data.to, // list of receivers
        subject: data.subject,
        text: data.text, // plain text body
        html: data.htm, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", mailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
);
module.exports = {sendEmail};