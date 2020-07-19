import {SET_TYPES} from './action_types';


const setTypes = (types) => {
    return {
        type: SET_TYPES,
        payload: types
    };
};


export default{
    setTypes
};