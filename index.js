const twilio = require('twilio');
const accountSid = 'AC817f3948584648749d09e77ded759a94';
const authToken = '57acf90aad1be2ed99a0744284e86d2e';
const client = new twilio(accountSid, authToken);

// Function to send IVR call
function sendIVRCall(toNumber, interviewLink) {
  const twiml = new twilio.twiml.VoiceResponse();

  twiml.say('Hello, this is a call from XYZ Corporation.');
  twiml.say('We are excited to invite you for an interview.');
  twiml.say('Please press 1 to confirm your interest.');

  twiml.gather({
    numDigits: 1,
    action: `/handle-key?interviewLink=${interviewLink}`,
    method: 'POST'
  });

  client.calls
    .create({
      from: '+12166001592',
      to: +918825153292,
      twiml: twiml.toString()
    })
    .then(call => {
      console.log(`Call created: ${call.sid}`);
    })
    .catch(error => {
      console.error(error);
    });
}

// Function to handle key press
function handleKeyPress(request, response) {
  const twiml = new twilio.twiml.VoiceResponse();
  const interviewLink = request.query.interviewLink;

  if (request.body.Digits === '1') {
    twiml.say('Thank you for confirming your interest.');
    twiml.say(`Please visit ${interviewLink} to schedule your interview.`);
  } else {
    twiml.say('Invalid input. Please try again.');
  }

  response.set('Content-Type', 'text/xml');
  response.send(twiml.toString());
}

// Express server to handle key press
const express = require('express');
const app = express();

app.post('/handle-key', (request, response) => {
  handleKeyPress(request, response);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// Send IVR call
sendIVRCall('+1234567890', 'https://example.com/interview-link');