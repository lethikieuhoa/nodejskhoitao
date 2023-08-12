require('dotenv').config();
const nodemailer = require("nodemailer");
let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });
    let info = await transporter.sendMail({
        from: '"Hoa Le" <lethikieuhoa103@gmail.com>', // sender address
        to: dataSend.receiverEmail,//"hana8484103@gmail.com", // list of receivers
        subject: getSubjectHTML(dataSend.language), // Subject line
        text: "Hello world?", // plain text body
        html: getBodyHTMLEmail(dataSend), // html body
    }, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}//this.getBodyHTMLEmail(dataSend.language)
let getSubjectHTML = (language) => {
    let rs = language === 'vi' ? "Thông tin đặc lịch khám bệnh" : "Information about medical examination schedule";
    return rs;
}
let getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'en') {
        result = `
        <h3>Dear ${dataSend.patientName}!</h3>
         <p>You received this email because you booked a medical appointment on my website.</p>
         <p>Special medical examination information:</p>
         <div><b>Time: ${dataSend.time}</b></div>
         <div><b>Doctor: ${dataSend.doctorName}</b></div>
         <p>If the above information is true, please click on the link below to confirm and complete the procedure to schedule a medical appointment.</p>
         <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
         <div>Thank you very much.</div>
        `;
    }
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trên website của tôi.</p>
        <p>Thông tin đặc lịch khám bệnh:</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặc lịch khám bệnh.</p>
        <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
        <div>Xin chân thành cảm ơn.</div>
        `;
    }
    return result;
}

module.exports = {
    sendSimpleEmail
}