import Dashboard from "../Screen/Dashboard/Dashboard";
import Auth from "../Screen/Auth/Auth";

const dashboardRoutes = {
    path:"",
    name:"Dash board",
    children: [
        {
            path: "/chat-home",
            name: "Dashboard",
            component: Dashboard
        }
    ]
};

const authRoutes = {
    path: "",
    name: "Auth",
    children: [
        {
            path: "/auth",
            name: "Auth",
            component: Auth
        }
    ]
};

export {
    dashboardRoutes,
    authRoutes
}

export const dashboard = [
    dashboardRoutes,
];

export const auth = [
    authRoutes
];