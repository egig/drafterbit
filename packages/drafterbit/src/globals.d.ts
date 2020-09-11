import Koa from 'koa'

declare interface ApplicationInterface extends Koa {

}

declare global {
    interface Window {}
}