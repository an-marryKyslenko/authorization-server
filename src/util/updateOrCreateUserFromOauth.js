import { getDbConnection } from "../db.js";

export const updateOrCreateUserFromOauth = async ({ oauthUserInfo }) => {
	const {
		id: googleId,
		verified_email: isVerified,
		email
	} = oauthUserInfo;

	const db = getDbConnection('auth');
	const existingUser = await db.collection('user').findOne({ email });


	if (existingUser) {
		const result = await db.collection('user').findOneAndUpdate(
			{ email },
			{ $set: { googleId, isVerified } },
			{returnDocument: false}
		);
		return result;
	} else {
		const result = await db.collection('user').insertOne({
			email,
			googleId,
			isVerified,
			info: {}
		});
		return result.ops[0]

	}
}