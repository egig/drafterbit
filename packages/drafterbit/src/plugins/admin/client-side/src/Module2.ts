import ClientSide from './ClientSide';

declare namespace Module2 {
    type StateReducer = {
        defaultState: Object,
        stateName: string,
        reducer: any
    }

    type AdminConfig = {routes: Object[]}
}

class Module2 {

    $dt: ClientSide;
    name: string = "";
    stateReducer: Module2.StateReducer = {defaultState: {}, stateName: "", reducer: null};

    routes: Object[] = [];
    admin: Module2.AdminConfig = {routes: []};

    constructor($dt: ClientSide) {
        this.$dt = $dt;
    }

    routeFilter(route: any, location: any, state: any) {
        return route;
    };

    async getMenu(): Promise<any[]> {
        return [];
    };

    renderNavBarMenu(i: string): any {
        return null;
    };

    registerApiClient() {
        return {}
    };

    stateFilter(state: any): any {
        return state
    }
}

export = Module2
