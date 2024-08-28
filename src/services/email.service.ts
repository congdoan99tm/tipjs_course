import newOtp from './otp.service';
import templateModel from '../models/template.model';
import templateService from './template.service';
import transport from '../dbs/init.nodemailler';

const _sendEmailLinkVerify = ({ html, toEmail, subject, text }) => {
  try {
    const mailOptions = {
      from: ' "ShopDEV" <anonystick@gmail.com>',
      to: toEmail,
      subject,
      text,
      html,
    };
    transport.sendMail(mailOptions, (err, info) => {
      if (err) {
        return console.log(err);
      }
      console.log(`Message sent::`, info.messageId);
    });
  } catch (error) {
    console.error(`error send Email::`, error);
    return error;
  }
};

const sendEmailToken = async (email: String = null) => {
  try {
    // 1. generator token
    const token = await newOtp(email);

    // 2. get template
    const template = await templateService.getTemplate('HTML EMAIL TOKEN');

    // 3. Send email
    _sendEmailLinkVerify({
      html: 'html',
      toEmail: email,
      subject: '',
      text: '',
    });
  } catch (error) {}
};

export default { sendEmailToken };
