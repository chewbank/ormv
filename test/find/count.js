'use strict';

const test = require('jtf');
const { model } = require('../db/');

const { tasks } = model;

test('count', async t => {

   const query = tasks.find({ 'id': 50, })

   const count = query.count();

   const result = await Promise.all([query, count]);

   t.ok(result);

   console.log(result);

})


test('find count', async t => {

   const result = await tasks
      .find({ 'id': 50, })
      .count()
      .catch(error => {
         const { message } = error;
         return {
            code: 1000,
            message
         }
      })

   t.ok(result);

   console.log(result);

})