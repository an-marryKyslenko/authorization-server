import bcrypt from 'bcrypt';
import { getDbConnection } from '../db.js';

export const resetPasswordRoute = {
	path: '/api/users/:passwordResetCode/reset-password',
	method: 'put',
	handler: async (req, res) => {
		const {passwordResetCode} = req.params;
		const {newPassword} = req.body;

		const db = getDbConnection('auth');
		const newPasswordHash = await bcrypt.hash(newPassword,10);
		const result = await db.collection('user').updateOne({ passwordResetCode },{
			$set: {passwortHash: newPasswordHash},
			$unset: {passwordResetCode: ''}
		});
		// if(result.lastErrorObject.n ===0)return res.sendStatus(404);

		res.sendStatus(200)

	}
}