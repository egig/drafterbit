import  express from 'express';
import user from '../user/routes';
import content from '../content/routes';
import auth from '../auth/routes';
import swagger from '../swagger/routes';
import admin from '../admin/routes';

let router = express.Router();
router.use(admin);
router.use(user);
router.use(auth);
router.use(content);
router.use(swagger);

export default router;