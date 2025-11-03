import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mjml2html from 'mjml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ForgotPasswordData {
  url: string;
}

/**
 * Generate the welcome email
 * @param {object} email - The email data
 * @param {string} email.url - The url of the application
 * @returns {string} - The generated email
 */
const generateForgotPasswordEmail = ({ url }: ForgotPasswordData): string => {
  // Read the MJML file fresh every time instead of caching at module load
  const ForgotPassword = readFileSync(`${__dirname}/mjml/forgot-password.mjml`, 'utf-8');

  let html = '';
  if (ForgotPassword) {
    html = ForgotPassword.replace(/\$url\$/g, url).replace('$year$', new Date().getFullYear().toString());
  }

  return mjml2html(html).html;
};

export default generateForgotPasswordEmail;
