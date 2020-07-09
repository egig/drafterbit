export default function Module() {

}

Module.prototype.routeFilter = function routeFilter(route) {
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
