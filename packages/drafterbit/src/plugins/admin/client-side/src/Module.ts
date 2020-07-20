import ClientSide from './ClientSide';

declare namespace Module {
    type StateReducer = {
        defaultState: Object,
        stateName: string,
        reducer: any
    }

    type AdminConfig = {routes: Object[]}

    type Menu = {
        link: string,
        icon: any,
        label: string,
        children?: Module.Menu[]
    }
}

class Module {

    $dt: ClientSide;
    name: string = "";
    stateReducer: Module.StateReducer = {defaultState: {}, stateName: "", reducer: null};

    routes: Object[] = [];
    admin: Module.AdminConfig = {routes: []};

    constructor($dt: ClientSide) {
        this.$dt = $dt;
    }

    routeFilter(route: any, location: any, state: any) {
        return route;
    };

    async getMenu(): Promise<Module.Menu[]> {
        return [];
    };

    renderNavBarMenu(i: string): any {
        return null;
    };

    registerApiClient(): any {
        return {}
    };

    stateFilter(state: any): any {
        return state
    }
}

export = Module
