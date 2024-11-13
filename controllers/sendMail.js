import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

export const sendMailbyEmail = async (req, res) => {
    try {
        let config = {
            service: 'gmail',
            auth: {
                user: 'aditya@netfotech.in',
                pass: 'uqznqhrpowczgpxh'
            }
        };

        let transporter = nodemailer.createTransport(config);

        let MailGenerator = new Mailgen({
            theme: "default",
            product: {
                name: "Mailgen",
                link: "https://mailgen.js/"
            }
        });

        let response = {
            body: {
                name: "Adii",
                intro: "Your bill has arrived",
                table: {
                    data: [
                        {
                            item: "Nodemailer Stack Book",
                            description: "A backend Application",
                            price: "100rs"
                        }
                    ]
                },
                outro: "Looking forward to your reply"
            }
        };

        let mail = MailGenerator.generate(response);

        let message = {
            from: "aditya@netfotech.in",
            to: "mannadebarghya2002@gmail.com",
            subject: "OTP Verification",
            html: mail
        };

        await transporter.sendMail(message);

        // Send the response after the email has been sent
        return res.status(201).json({
            msg: "You should receive an email"
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
