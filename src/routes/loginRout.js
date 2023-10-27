import bcryct from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDbConnection } from "../db.js";

export const LogInRoute = {
	path: '/api/login',
	method: 'post',
	handler: async (req, res) => {
		const { email, password } = req.body;

		const db = getDbConnection('auth');
		const user = await db.collection('user').findOne({ email });

		if (!user) {
			res.sendStatus(401)
		}
		const { _id: id, isVarified, passwordHash, info } = user;
		const isCorrect = await bcryct.compare(password, passwordHash);

		if (isCorrect) {
			jwt.sign(
				{ id, isVarified, email, info },
				process.env.JWT_SECRET,
				{
					expiresIn: '2d'
				},
				(err, token) => {
					if (err) {
						return res.status(500).send(err)
					}
					res.status(200).json({ token })
				}
			)
		} else {
			res.sendStatus(401)
		}

	}
}