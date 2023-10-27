import { sendEmail } from "../util/sendEmail.js";

export const testEmailRoute = {
    path: '/api/test-email',
    method: 'post',
    handler: async (req, res) => {
        try {
            await sendEmail({
                to: 'marusia199510@gmail.com',
                from: 'olih.a@icloud.com',
                subject: 'does this Work?',
                text: 'if you read it, it\'s work'
            })
            res.sendStatus(200);
        } catch (error) {
            console.log(error)
            res.sendStatus(500);
        }
    },
};