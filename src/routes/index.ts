import express from 'express';
import { apiKey, permission } from '../auth/checkAuth';
const router = express.Router();
import upload from './upload';
import checkout from './checkout';
import profile from './profile';
import discount from './discount';
import inventory from './inventory';
import cart from './cart';
import product from './product';
import cmt from './comment';
import notify from './notification';
import access from './access';
// import { pushToLogDiscord }  from '../middleware/index'
// add log to discord
// router.use(pushToLogDiscord)
// check api key
router.use(apiKey);
// check permission
router.use(permission('0000'));

router.use('/v1/api/checkout', checkout);
router.use('/v1/api/profile', profile);
router.use('/v1/api/discount', discount);
router.use('/v1/api/inventory', inventory);
router.use('/v1/api/cart', cart);
router.use('/v1/api/product', product);
router.use('/v1/api/upload', upload);
router.use('/v1/api/comment', cmt);
router.use('/v1/api/notification', notify);
router.use('/v1/api', access);

export default router;
