import Application from "./Application";
import Router from '@koa/router';
import commander from 'commander';
import Plugin from './Plugin';

exports = module.exports = function createApplication() {
    return new Application()
};

exports.Router = Router;
exports.Plugin = Plugin;
exports.Command = commander.Command;