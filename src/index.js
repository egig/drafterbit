import express from 'express';
import config from './config';
import boot from './boot';

const app = express();

import listen from  './swagger/listener'

listen(app);

const port = config.get('PORT');

boot(app);

app.listen(port, function () {
	console.log('Example app listening on port ' + port + '!');
});