import { SuccessResponse } from '../core/success.response';
import { listNotiByUser } from '../services/notification.service';

class NotificationController {
  listNotiByUser = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new List Notifications',
      metadata: await listNotiByUser(req.query),
    }).send(res);
  };
}
export default new NotificationController();
