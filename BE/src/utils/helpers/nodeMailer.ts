import nodemailer from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import env from '../env';


// Use environment values when provided, otherwise fall back to the
// embedded test credentials above.
let email = env.SMTP_EMAIL;
let password = env.SMTP_PASSWORD;

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: email,
    pass: password,
  },
});

/**
 * Send an email from AWS SES
 * @param {string|string[]} toEmail - The email address to send to
 * @param {string} emailHtml - The HTML content of the email
 * @param {string} subject - The subject of the email
 * @param {string} attachments - The attachments of the email
 * @returns {Promise<SendEmailResponse | null>} - The response from the AWS SES send email command
 */
const sendEmail = async (
  toEmail: string | string[],
  emailHtml: string,
  subject: string,
  attachments: Mail.Attachment[] = [],
): Promise<SMTPTransport.SentMessageInfo> => {
  const result = await transporter.sendMail({
    from: email, // Use the SMTP_EMAIL from environment
    to: toEmail,
    subject,
    html: emailHtml,
    attachments,
  });

  return result;
};

const NodeMailer = {
  sendEmail,
};

export default NodeMailer;
