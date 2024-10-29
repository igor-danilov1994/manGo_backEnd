import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            tls: {
                rejectUnauthorized: false,
            },
            connectionTimeout: 60000,
            auth: {
                user: process.env.USER_FOR_SEND_MESSAGE,
                pass: process.env.PASS_FOR_SEND_MESSAGE,
            },
        });
    }

    async sendMail(mailOptions: nodemailer.SendMailOptions) {
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Email sent: " + info.response);
            return info;
        } catch (error) {
            console.error("Error sending email: ", error);
            throw error;
        }
    }
}

export default new EmailService();
