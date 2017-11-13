import Dashboard from './components/Dashboard';
import Login from '../user/components/Login';

let routes = [
    { path: '/admin/login',
      component: Login,
	    isPublic: true
    },
    { path: '/admin',
      component: Dashboard
    }
];

export default routes;