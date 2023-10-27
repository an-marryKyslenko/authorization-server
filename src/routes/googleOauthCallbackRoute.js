import jwt from 'jsonwebtoken';
import { getGoogleUser } from '../util/getGoogleUser.js';
import { updateOrCreateUserFromOauth } from '../util/updateOrCreateUserFromOauth.js';

export const googleOauthCallbackRoute = {
	path: '/auth/google/callback',
	method: 'get',
	handler: async (req, res) => {
		const { code } = req.query;

		const oauthUserInfo = await getGoogleUser({ code });
		const updateUser = await updateOrCreateUserFromOauth({ oauthUserInfo });
		const { _id: id, isVerified, email, info } = updateUser;

		jwt.sign(
			{ id, isVerified, email, info },
			process.env.JWT_SECRET,
			(err, token) => {
				if (err) return res.sendStatus(500).json({ error: err.message });
				res.redirect(`http://localhost:3000/info?token=${token}`)
			}
		)
	}
}