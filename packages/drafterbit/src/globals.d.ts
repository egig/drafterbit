import ClientSide from "./plugins/admin/client-side/src/ClientSide";

declare var $dt: ClientSide;

declare global {
    interface Window {
        $dt: ClientSide;
        __DT_CONFIG__: any;
    }
}