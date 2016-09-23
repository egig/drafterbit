const knex = require("knex");
const util = require("util");
const winston = require("winston");

//
// Export the constructor
//
const Knex = exports.Knex = winston.transports.Knex = function(options) {

    this.name = "knex";
    this.level = options.level || "info";

    options = options || {};

    if(!options.tableName) {
      throw new Error("Knex transport requires \"tableName\".");
    }

    if(!options.knexInstance) {
      throw new Error("Knex transport requires knex options.");
    }

    this.tableName = options.tableName;
    this.knexInstance = options.knexInstance;
}

//
// Inherit from Winston.Transport
//
util.inherits(Knex, winston.Transport);

//
// Expose the log method
// This uses a connection pool and an assumed-valid SQL statement.
//
Knex.prototype.log = function(level, msg, meta, callback) {
    var self = this;

    this.knexInstance(self.tableName).insert({
      level: level,
      msg: msg,
      meta: JSON.stringify(meta),
    }).then(callback);
}
