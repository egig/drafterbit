import React from 'react';
import SubRoutes from '../../SubRoutes';
import { Route, Link } from 'react-router-dom';

const Sandwiches = () => <h2>Sandwiches</h2>;

const Tacos = ({ routes }) => (
    <div>
        <h2>Tacos</h2>
        <ul>
            <li><Link to="/tacos/bus">Bus</Link></li>
            <li><Link to="/tacos/cart">Cart</Link></li>
        </ul>

        {routes.map((route, i) => (
            <SubRoutes key={i} {...route}/>
        ))}
    </div>
);

const Bus = () => <h3>Bus</h3>;
const Cart = () => <h3>Cart</h3>;


let routes = [
    { path: '/sandwiches',
        component: Sandwiches
    },
    { path: '/tacos',
        component: Tacos,
        routes: [
            { path: '/tacos/bus',
                component: Bus
            },
            { path: '/tacos/cart',
                component: Cart
            }
        ]
    }
];

export default routes;