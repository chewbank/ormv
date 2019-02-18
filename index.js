'use strict'

const { Client } = require('pg');
const Model = require('./lib/model');
const Op = require('./lib/options');
const Type = require('./lib/type');

class Ormv extends Client {
   constructor(options) {
      const {db} =options
      db.user = db.username
      super(db)
      this.models = {}
      const { logger } = options
      if (logger === true) {
         this.logger = function (sql) {
            console.log('\x1b[33m[pgsql]', `\x1b[32m${sql}\x1b[39m`);
         }
      } else if (typeof logger === 'function') {
         this.logger = logger
      } else {
         this.logger = function () { }
      }
   }
   /**
    * 定义schema
    * @param {*} name 模型名称
    * @param {*} attributes 字段属性
    */
   define(name, attributes) {

      const model = new Model({
         name,
         attributes,
         client: this
      });

      this.models[name] = model;

      return model;

   }
}

Ormv.Op = Op

Ormv.Type = Type

module.exports = Ormv