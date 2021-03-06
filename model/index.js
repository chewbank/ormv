'use strict';

const Ormv = require('../lib/index.js');

const ormv = new Ormv({
   host: 'localhost',
   database: 'test',
   username: 'postgres',
   password: 'M2Idiftre&34FS',
   port: 5532,
   logger: true,
});

ormv.connect(error => {
   if (error) {
      console.error('pgsql ', error.stack);
   } else {
      console.log('pgsql connect success');
   }
});

exports.Ormv = Ormv;
exports.ormv = ormv;

const user = require('./user.js');
const tasks = require('./tasks.js');
const admin = require('./admin.js');
const tasksUser = require('./tasksUser.js');
const vTasks = require('./vTasks.js');

exports.model = {
   tasks,
   user,
   admin,
   tasksUser,
   vTasks,
}