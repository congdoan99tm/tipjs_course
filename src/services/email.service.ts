import newOtp from './otp.service';
import templateService from './template.service';
import transport from '../dbs/init.nodemailler';
import { NotFoundError } from '../core/error.response';
import { replacePlaceholder } from '../utils';

const _sendEmailLinkVerify = ({
  html,
  toEmail,
  subject = 'Xác nhận email đăng ký',
  text = 'Xác nhận...',
}) => {
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
    if (!template) {
      throw new NotFoundError('Template not found');
    }
    // 3. replace placeholder with params
    const content = replacePlaceholder(template.tem_html, {
      link_verify: `http://localhost:3052/cgp/welcome-back?token=${token}`,
    });
    
    // 4. Send email
    _sendEmailLinkVerify({
      html: 'html',
      toEmail: email,
      subject: 'Vui lòng xác nhận địa chỉ email đăng ký shopDEV',
      text: '',
    });
  } catch (error) {}
};

export default { sendEmailToken };
