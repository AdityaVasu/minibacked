
require('dotenv').config();
const bodyParser = require('body-parser'); 
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
}));
app.use(bodyParser.json());
/**
 * @param {string} to Recipient's email address
 * @param {string} subject Subject of the email
 * @param {string} textBody Plain text body of the email
 * @param {string} htmlBody HTML body of the email (optional)
 */
const sendEmail = (to, subject, textBody, htmlBody = '') => {
  let mailOptions = {

    from: process.env.EMAIL_USER, // Sender address
    to: to, // List of recipients
    subject: subject, // Subject line
    text: textBody, // Plain text body
    html: htmlBody // HTML body

  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};
app.post('/send', async (req, res) => {
  const {prompt} = req.body; // Extract 'prompt' from req.body
  console.log('Prompt received:', prompt);
  console.log('Prompt received:', req.body);
  const to = "mrhitech555@gmail.com";
  const subject = "mailtoadityabiradar";
  const textBody = "hello";

  // Construct HTML body with prompt
  const htmlBody = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #d9534f;">Alert: High Negativity Score Detected</h2>
        <p>The following message has been flagged with a negativity score of <strong>0.94</strong>:</p>
        <blockquote style="border-left: 4px solid #d9534f; padding-left: 10px; color: #333;">
          
        </blockquote>
        <p>Prompt: ${prompt}</p>
        <p>Please review the content and take the necessary actions.</p>
      </body>
    </html>
  `;

  try {
    // Validate required fields
    if (!to || !subject || !textBody) {
      throw new Error('Missing required query parameters: to, subject, and textBody');
    }

    // Send email and handle response
    await sendEmail(to, subject, textBody, htmlBody);
    res.send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send(`Error sending email: ${error.message}`);
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});