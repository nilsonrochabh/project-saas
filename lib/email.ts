// lib/email.ts
import nodemailer from 'nodemailer';
console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASSWORD);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendResetEmail(email: string, resetUrl: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Redefinição de Senha',
    text: `Clique no link abaixo para redefinir sua senha:\n\n${resetUrl}`,
    html: `<p>Clique <a href="${resetUrl}">aqui</a> para redefinir sua senha.</p>`,
  };

  await transporter.sendMail(mailOptions);
}