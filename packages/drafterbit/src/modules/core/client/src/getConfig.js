/**
 * 
 * @param {*} name 
 */
export default function getConfig(name) {
    if(!window.__DRAFTERBIT_CONFIG__) {
        throw new Error('Can not find global config');
    }

    if(!window.__DRAFTERBIT_CONFIG__.hasOwnProperty(name)) {
        throw new Error(`Can not find config value for: ${name}`);        
    }

    return window.__DRAFTERBIT_CONFIG__[name];
}