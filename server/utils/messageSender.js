const twilio = require('twilio');
require("dotenv").config();

const accountSid = process.env.TWILIO_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_TOKEN;   // Your Auth Token from www.twilio.com/console
const client = twilio(accountSid, authToken);

// Function to send an SMS
const sendSms = (to, message) => {
    client.messages.create({
        body: message,
        from: '+916201350318', // Your Twilio number
        to: to
    })
    .then(message => console.log(message.sid))
    .catch(error => console.error(error));
};

// Function to send a WhatsApp message
const sendWhatsApp = (to, message) => {
    client.messages.create({
        body: message,
        from: 'whatsapp:+916201350318', // Your Twilio WhatsApp number
        to: `whatsapp:${to}`
    })
    .then(message => console.log(message.sid))
    .catch(error => console.error(error));
};

module.exports = { sendSms, sendWhatsApp };
