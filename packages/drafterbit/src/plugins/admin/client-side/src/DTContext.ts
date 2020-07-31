import React from 'react';
import ClientSide from "./ClientSide";

const DTContext: React.Context<ClientSide> = React.createContext(window.$dt);

export default DTContext;