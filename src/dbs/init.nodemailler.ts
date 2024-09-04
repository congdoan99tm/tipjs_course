import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  service: 'gmail',
  secure: true,
  auth: {
    user: 'congdoan@dinos.vn',
    pass: process.env.GG_APP_PASS,
  },
});
export default transport;
