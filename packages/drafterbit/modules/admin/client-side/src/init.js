import ClientSide from './ClientSide'

const drafterbit = new ClientSide(window.__DT_CONFIG__);
window.$dt = drafterbit;

export default drafterbit


