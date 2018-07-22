import NewProject from './components/NewProject';
import Projects from './components/Projects';

let routes = [
    {
        path: '/project/new',
        component: NewProject
    },
    {
        path: '/projects',
        component: Projects
    }

];

export default routes;