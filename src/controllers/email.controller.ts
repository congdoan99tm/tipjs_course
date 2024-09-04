import { SuccessResponse } from '../core/success.response';
import templateService from '../services/template.service';
class EmailController {
  newTemplate = async (req, res, next) => {
    new SuccessResponse({
      message: 'new template',
      metadata: await templateService.newTemplate(req.body),
    }).send(res);
  };
}

export default new EmailController();
