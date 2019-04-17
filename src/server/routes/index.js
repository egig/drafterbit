import  express from 'express';
import user from './user';
import content_type from './content_type';
import content from './content';
import api_key from './api_key';
import swagger from './swagger';
import api from './api';

let router = express.Router();
router.use(user);
router.use(content_type);
router.use(api_key);
router.use(content);
router.use(swagger);
router.use(api);

export default router;