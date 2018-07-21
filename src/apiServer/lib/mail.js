const Mailjet = require ('node-mailjet');
const axios = require('axios');
const config = require('../../config');


const sendResetPasswordEmail = (to) => {

	let data = {
	"Messages":[
		{
			"From": {
				"Email": "noreply@drafterbit.com",
				"Name": "Drafterbit Team"
			},
			"To": [
				{
					"Email": to
				}
			],
			"Subject": "Password Reset Request",
			"HTMLPart": "<h1>Lost your Password ?</h1> <p>Its okay, let's create new one</p> <p>Please click link below<p/> <a href=\"https://www.drafterbit.com/reset-password?token=7f9036ca8527e7ff6d1cb4bf6ad0002\">Reset My Password</a>"
		}
	]
	};

	return axios.post("https://api.mailjet.com/v3.1/send", data, {
		auth: {
			username: config.get("MAILJET_APIKEY_PUBLIC"),
			password: config.get("MAILJET_APIKEY_PRIVATE")
		},
	})
		.then(r => {
			return r.data
		});
};

module.exports = {
	sendResetPasswordEmail
};