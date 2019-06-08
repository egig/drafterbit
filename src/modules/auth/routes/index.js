import  express from 'express';
import api_key from './api_key';

let router = express.Router();
router.use(api_key);

module.exports = router;