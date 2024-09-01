require('dotenv').config();
import nodemailer from "nodemailer"
let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '"Alex Xander 👻" <duachutthoid@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thông Tin Đặt Lịch Khám bệnh ✔", // Subject line
        text: "Konichiwa?", // plain text body
        html: getBodyHTMLEmail(dataSend), // html body
    });

};
let getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
    <h3>Xin Chào  ${dataSend.patientName}!</h3>
    <p>Nếu bạn nhận được email này sau khi bạn đặt lịch hẹn với bác sĩ! Trên trang web AlexSanDer đẹp trai  </p>
    <p>Thông Tin:</p>
    <div><b>Thời Gian: ${dataSend.time}</b></div>
     Nếu những thông tin này chính xác, vui lòng xác nhận và hoàn tất cuộc hẹn khám bệnh của bạn với bác sĩ.</p>
    <div>
    <a href=${dataSend.redirecLink} target="_blank" >Nhấp vào đây để xác nhận</a>

    </div>
    <div>Xin Chân Thành Cảm Ơn!</div>
    
    `
    } if (dataSend.language === 'en') {
        result = `
    <h3>Hello${dataSend.patientName}!</h3>
    <p>If you taked this mail after you  to take an appointment to the doctor! On Website AlexSanDer handsome  </p>
    <p>Information:</p>
    <div><b>Time: ${dataSend.time}</b></div>
    <div><b>Doctor: ${dataSend.doctorName}</b></div>
    <p>If these information is exactlly please to confirm and complete your medium appointment to doctor.</p>
    <div>
    <a href=${dataSend.redirecLink} target="_blank" >Click Here to confirm</a>

    </div>
    <div>Thank for alls</div>
    
    `
    }
    return result;
};
let sendAttachment = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '"Alex Xander 👻" <duachutthoid@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Kết Quả  Lịch Khám bệnh ✔", // Subject line
        text: "Konichiwa?", // plain text body
        html: getBodyHTMLEmailRemedy(dataSend), // html body
        // attach image
        attachments: [
            {
                filename: `remedy-${dataSend.patientId}-${dataSend.patientName}.png`,
                content: dataSend.image.split("base64,")[1],
                encoding: 'base64'
            }
        ], // attachments
    });
};
let getBodyHTMLEmailRemedy = (data) => {
    let result = '';
    if (data.language === 'vi') {
        result = `
    <h3>Xin Chào  ${data.patientName} !</h3>
    <p>Nếu bạn nhận được email này sau khi bạn đặt lịch hẹn với bác sĩ! Trên trang web AlexSanDer đẹp trai  </p>
    <p>Thông tin đơn thuốc đã được gửi trong file đính kèm</p>
   
    <div>Xin Chân Thành Cảm Ơn!</div>
    
    `
    } if (data.language === 'en') {
        result = `
    <h3>Dear Name!</h3>
    <p>If you taked this mail after you  to take an appointment to the doctor! On Website AlexSanDer handsome  </p>
    <p>hohoho</p>
    
    <div>Thank for alls</div>
    
    `
    }
    return result;
}



module.exports = {
    sendSimpleEmail, sendAttachment
}