import ClientSide from "./ClientSide";

export = function createDefaultState($dt: ClientSide) {

    let defaultState: any = {};
    $dt.modules.map(mo => {
        if(mo.stateReducer) {
            if (mo.stateReducer.stateName !== "") {
                defaultState[mo.stateReducer.stateName] = mo.stateReducer.defaultState;
            }
        }
    });

    return defaultState;
}
