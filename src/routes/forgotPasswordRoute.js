import { v4 as uuid } from 'uuid';
import { sendEmail } from '../util/sendEmail.js';
import { getDbConnection } from '../db.js';

export const forgotPaswordRoute = {
	path: '/api/forgot-password/:email',
	method: 'put',
	handler: async (req, res) => {
		const { email } = req.params;

		const passwordResetCode = uuid();

		const db = getDbConnection('auth');
		const result = await db.collection('user').updateOne({ email }, { $set: { passwordResetCode } }, { upsert: false });

		if (result.modifiedCount > 0) {
			try {
				await sendEmail({
					to: email,
					from: 'olih.a@icloud.com',
					subject: 'Password reset',
					text: `Reset your password,click this link:http://localhost:3000/reset-password/${passwordResetCode}`
				})
			} catch (error) {
				console.log(error.message);
				res.sendStatus(500)
			}
		}
		res.sendStatus(200);
	}
}