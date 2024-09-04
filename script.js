const twilio = require('twilio');
const express = require('express');
const app = express();

const accountSid = 'AC817f3948584648749d09e77ded759a94';  //Twilio Account SID
const authToken = '57acf90aad1be2ed99a0744284e86d2e';    // Twilio Auth Token
const client = new twilio(accountSid, authToken);

// Start a call with IVR
client.calls.create({
    twiml: '<Response><Play>https://drive.google.com/file/d/1CcAolUvJrdnyqutLIp972RT8Wvy9B1Rv/view?usp=sharing</Play><Gather action="/gather" method="GET" numDigits="1"/></Response>',
    to: '+918825153292',  // phone number
    from: '+12166001592'  // Twilio number
}).then(call => console.log('Call SID:', call.sid));

// Endpoint to handle user's digit input
app.get('/gather', (req, res) => {
    const digit = req.query.Digits;  // The digit pressed by the user
    if (digit == '1') {
        client.messages.create({
            body: 'Here is your personalized interview link: [link]',
            from: '+12166001592',  // Twilio number
            to: '+918825153292'    // phone number
        }).then(message => console.log('Message SID:', message.sid));
    }
    res.send('<Response><Say>Thank you!</Say></Response>');
});

// Start the server
app.listen(3000, () => console.log('Server is running on port 3000'));
