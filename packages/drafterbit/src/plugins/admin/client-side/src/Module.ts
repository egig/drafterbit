export default function Module() {

}

Module.prototype.routes = [];
Module.prototype.admin = {
    routes: []
};

Module.prototype.routeFilter = function routeFilter(route: string) {
    return route;
};

Module.prototype.getMenu = async function getMenu() {
    return [];
};

Module.prototype.renderNavBarMenu = function () {
    return null;
};

Module.prototype.registerApiClient = function registerApiClient() {
    return {}
};
