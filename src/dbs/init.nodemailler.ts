import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  // host: 'asdff',
  // port:'',
  secure: true,
  auth: {
    user: '',
    pass: '',
  },
});
export default transport;
