import Dashboard from './components/Dashboard';
import Login from '../user/components/Login';

let routes = [
	{
		path: '/login',
		component: Login,
		isPublic: true
	},
	{ path: '/',
		component: Dashboard
	}

];

export default routes;