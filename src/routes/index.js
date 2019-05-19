import  express from 'express';
import user from '../modules/user/routes';
import content from '../modules/content/routes';
import auth from '../modules/auth/routes';
import swagger from '../modules/swagger/routes';
import admin from '../modules/admin/routes';

let router = express.Router();
// router.use(admin);
router.use(user);
// router.use(auth);
router.use(content);
// router.use(swagger);

export default router;