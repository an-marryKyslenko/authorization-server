import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { getDbConnection } from '../db.js';

export const updateUserInfoRoute = {
	path: '/api/users/:userId',
	method: 'put',
	handler: async (req, res) => {
		const { authorization } = req.headers;
		const { userId } = req.params;

		const updates = (({
			favoriteFood,
			hairColor,
			bio
		}) => ({
			favoriteFood,
			hairColor,
			bio
		}))(req.body)

		if (!authorization) return res.status(401).json({ message: 'No authorization user' })

		const token = authorization.split(' ')[1];

		jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
			if (err) return res.status(401).json({ message: 'Unable to verify token' })

			const { id, isVerified } = decoded;

			if (id !== userId) return res.status(403).json({ message: 'Not allowed to update that user\'s data' });
			if (!isVerified) return res.status(403).json({ message: 'Need to verify your email before you can update your data!' })
			const db = getDbConnection('auth');
			const result = await db.collection('user').findOneAndUpdate(
				{ _id: new ObjectId(id) },
				{ $set: { info: updates } },
				{ returnDocument: false },
			);
			const { email, isVerified: verified, info } = result

			jwt.sign({ id, email, verified, info }, process.env.JWT_SECRET, { expiresIn: '2d' }, (err, token) => {
				if (err) return res.status(200).json(err)
				res.status(200).json({ token })
			})
		})
	}
}