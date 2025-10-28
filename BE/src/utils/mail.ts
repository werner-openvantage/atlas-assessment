import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import NodeMailer from './helpers/nodeMailer';
import type Mail from 'nodemailer/lib/mailer';

/**
 * Send an email from AWS SES
 * @param {string|string[]} toEmail - The email address to send to
 * @param {string} emailHtml - The HTML content of the email
 * @param {string} subject - The subject of the email
 * @param {string} attachments - The subject of the email
 * @returns {Promise<SMTPTransport.SentMessageInfo | null>} - The response from the AWS SES send email command
 */
export const sendEmail = async (
  toEmail: string | string[],
  emailHtml: string,
  subject: string,
  attachments: Mail.Attachment[] = [],
): Promise<SMTPTransport.SentMessageInfo | null> => {
  return await NodeMailer.sendEmail(toEmail, emailHtml, subject, attachments);
};
