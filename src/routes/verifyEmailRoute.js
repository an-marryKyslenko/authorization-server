import {ObjectId} from 'mongodb';
import jwt from 'jsonwebtoken';
import { getDbConnection } from '../db.js';

export const verifyEmailRoute = {
	path: '/api/verify-email',
	method: 'put',
	handler: async(req,res)=>{
		const {verificationString} = req.body;
		const db = getDbConnection('auth');
		const result = await db.collection('user').findOne({
			verificationString,
		})
		if(!result)return res.status(401).json({message: 'The email verification code is not corect!'})

		const {_id: id, email,info} = result;

		await db.collection('user').updateOne({_id: new ObjectId(id)},{
			$set: {isVerified: true}
		})

		jwt.sign({id,email,isVerified: true,info},
			process.env.JWT_SECRET, 
			{expiresIn: '2d'},
			(err,token)=>{
				if(err) return res.status(500)
				res.status(200).json({token})
			})
	}
}