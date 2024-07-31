import { SuccessResponse } from '../core/success.response';
import CommentService from '../services/comment.service';

class CommentController {
  createComment = async (req, res, next) => {
    new SuccessResponse({
      message: 'Created new comment',
      metadata: await CommentService.createComment(req.body),
    }).send(res);
  };

  getCommentsByParentId = async (req, res, next) => {
    new SuccessResponse({
      message: 'List comments',
      metadata: await CommentService.getCommentsByParentId(req.query),
    }).send(res);
  };
}
export default new CommentController();
