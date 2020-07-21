import {SET_TYPES} from './action_types';


const setTypes = (types: any) => {
    return {
        type: SET_TYPES,
        payload: types
    };
};


export default{
    setTypes
};