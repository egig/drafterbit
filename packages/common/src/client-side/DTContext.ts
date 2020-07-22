import React, {ReactNode} from 'react';
import ClientSide from "drafterbit/dist/plugins/admin/client-side/src/ClientSide";

const DTContext: React.Context<ClientSide> = React.createContext(window.$dt);

export default DTContext;