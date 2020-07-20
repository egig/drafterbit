import ClientSide from "./plugins/admin/client-side/src/ClientSide";
import Koa from 'koa'

declare interface ApplicationInterface extends Koa {

}

declare global {
    interface Window {
        $dt: ClientSide;
        __DT_CONFIG__: any;
        __PRELOADED_LANGUAGE_RESOURCES__: any;
        __PRELOADED_STATE__: any;
    }
}