import Dashboard from '../common/components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';

let routes = [
	{
		path: '/login',
		component: Login,
		isPublic: true
	},
	{
		path: '/register',
		component: Register,
		isPublic: true
	},
	{
		path: '/forgot-password',
		component: ForgotPassword,
		isPublic: true
	},
	{ path: '/',
		component: Dashboard
	}

];

export default routes;