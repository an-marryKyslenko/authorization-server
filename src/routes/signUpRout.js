import bcryct from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { v4 as uuid } from 'uuid';
import { getDbConnection } from "../db.js";
import { sendEmail } from '../util/sendEmail.js';
export const signUpRoute = {
	path: '/api/signup',
	method: 'post',
	handler: async (req, res) => {
		const { email, password } = req.body;

		const db = getDbConnection('auth');
		const user = await db.collection('user').findOne({ email });

		if (user) {
			res.sendStatus(409)
		}

		const passwordHash = await bcryct.hash(password, 10);

		const verificationString = uuid();
		const startingInfo = {
			hairColor: '',
			favoriteFood: '',
			bio: '',
		}
		const result = await db.collection('user').insertOne({
			email,
			passwordHash,
			info: startingInfo,
			isVerified: false,
			verificationString,
		})

		const { inseredId } = result;

		try {
			await sendEmail({
				to: email,
				from: 'olih.a@icloud.com',
				subject: 'Please verify your email',
				text: `
				Thanks form signing up! To verify your email,click here:
				http://localhost:3000/verify-email/${verificationString}`
			})
		} catch (error) {
			console.log(error)
			res.sendStatus(500)
		}

		jwt.sign({
			id: new ObjectId(inseredId),
			email,
			info: startingInfo,
			isVerified: false,
		},
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
		);

	}
}