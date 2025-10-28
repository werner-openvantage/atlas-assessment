import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mjml2html from 'mjml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WelcomeEmail = readFileSync(`${__dirname}/mjml/welcome.mjml`, 'utf-8');

interface WelcomeEmailData {
  firstName: string;
  lastName: string;
  email: string;
  url: string;
}

/**
 * Generate the welcome email
 * @param {object} email - The email data
 * @param {string} email.firstName - The first name of the user
 * @param {string} email.lastName - The last name of the user
 * @param {string} email.email - The email of the user
 * @param {string} email.url - The url of the application
 * @returns {string} - The generated email
 */
const generateWelcomeEmail = ({ firstName, lastName, email, url }: WelcomeEmailData): string => {
  let html = '';
  const mjml = WelcomeEmail;
  if (WelcomeEmail) {
    html = mjml
      .replace('$firstName$', firstName)
      .replace('$lastName$', lastName)
      .replace('$email$', email)
      .replace('$year$', new Date().getFullYear().toString())
      .replace('$url$', url);
  }

  return mjml2html(html).html;
};

export default generateWelcomeEmail;
