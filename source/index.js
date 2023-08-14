const aws = require("aws-sdk");
const aws_ses = new aws.SES({ region: "ap-northeast-2" });
const nodeEmail = require("nodemailer");

exports.handler = async function (event) {
    const eventBody = JSON.parse(event.body);
    const emailData = eventBody.emailData;
    const attachData = eventBody.attachFile;

    // email 내용 설정
    const mailOptions = {
        from: "admin@soystudy.com",
        subject: emailData.title,
        text: emailData.content,
        to: emailData.receiver,
        // bcc: Any BCC address you want here in an array,
        attachments: attachData && [
            {
                filename: attachData.fileName,
                path: attachData.fileData,
            },
        ],
    };

    const emailTransporter = nodeEmail.createTransport({
        SES: aws_ses,
    });

    const mailResponse = await emailTransporter.sendMail(mailOptions);

    const response = {
        statusCode: 200,
        body: JSON.stringify("Email sent complete"),
    };

    return response;
};
