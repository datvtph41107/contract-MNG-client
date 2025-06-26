import config from "~/config";
import AdminLayout from "~/layouts/AdminLayout";
import CreateContractLayout from "~/layouts/CreateContractLayout";
import DefaultLayout from "~/layouts/DefaultLayout";
import LoginLayout from "~/layouts/LoginLayout";
import Admin from "~/page/admin/Admin";
import AdminLogin from "~/page/admin/AdminLogin";
import Login from "~/page/client/Login";
import ContractPage from "~/page/Contract/ContractPage";
import Dashboard from "~/page/Dashboard";
import ContractDaft from "~/page/Contract/ContractDaft";
import ContractDetail from "~/page/Contract/ContractDetail";
import CreateContract from "~/page/Contract/CreateContract";
import ContractTypeManager from "~/page/Contract/ContractTypeManager";

// Public routes
const publicRoutes = [
    { path: config.routes.dashboard, component: Dashboard, DefaultLayout },
    { path: config.routes.login, component: Login, layout: LoginLayout },

    //Manager
    { path: config.routes.managerDashboard, component: Login, layout: DefaultLayout },
    { path: config.routes.createContract, component: CreateContract, layout: CreateContractLayout },
    { path: config.routes.contract, component: ContractDaft, layout: CreateContractLayout },
    { path: config.routes.contractPages, component: ContractPage, layout: DefaultLayout },
    { path: config.routes.contractDetail, component: ContractDetail, layout: DefaultLayout },
    { path: config.routes.contractTypes, component: ContractTypeManager, layout: DefaultLayout },

    // Admin
    { path: config.routes.adminLogin, component: AdminLogin },
    { path: config.routes.admin, component: Admin, layout: AdminLayout },
];

// Private routes for admin
const privateRoutes = [];

export { publicRoutes, privateRoutes };
