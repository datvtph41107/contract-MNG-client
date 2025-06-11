import config from "~/config";
import AdminLayout from "~/layouts/AdminLayout";
import DefaultLayout from "~/layouts/DefaultLayout";
import LoginLayout from "~/layouts/LoginLayout";
import Admin from "~/page/admin/Admin";
import AdminLogin from "~/page/admin/AdminLogin";
import Login from "~/page/client/Login";
import Dashboard from "~/page/Dashboard";

// Public routes
const publicRoutes = [
    { path: config.routes.dashboard, component: Dashboard, DefaultLayout },
    { path: config.routes.login, component: Login, layout: LoginLayout },

    //Manager
    { path: config.routes.managerDashboard, component: Login, layout: DefaultLayout },
    // Admin
    { path: config.routes.adminLogin, component: AdminLogin },
    { path: config.routes.admin, component: Admin, layout: AdminLayout },
];

// Private routes for admin
const privateRoutes = [];

export { publicRoutes, privateRoutes };
