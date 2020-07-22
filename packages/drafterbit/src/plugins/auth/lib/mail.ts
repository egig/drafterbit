const axios =  require('axios');


module.exports =  function sendResetPasswordEmail(to: string) {

    let data = {
        'Messages':[
            {
                'From': {
                    'Email': 'noreply@apname.com',
                    'Name': 'apname Team'
                },
                'To': [
                    {
                        'Email': to
                    }
                ],
                'Subject': 'Password Reset Request',
                'HTMLPart': '<h1>Lost your Password ?</h1> <p>Its okay, let\'s create new one</p> <p>Please click link below<p/> <a href="#">Reset My Password</a>'
            }
        ]
    };

    return axios.post('https://api.mailjet.com/v3.1/send', data, {
        auth: {
            // username: config.get('MAILJET_APIKEY_PUBLIC'),
            // password: config.get('MAILJET_APIKEY_PRIVATE')
        },
    })
        .then((r: any)  => {
            return r.data;
        });
};