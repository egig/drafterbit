import  express from 'express';
import content_type from './content_type';
import content from './content';
import main from './main';

let router = express.Router();
router.use(content_type);
router.use(content);
router.use(main);

export default router;