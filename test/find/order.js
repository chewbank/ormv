'use strict';

const test = require('jmr');
const typea = require('@chewbank/typea');
const { Ormv, model } = require('../../model/');

const { $as } = Ormv.Op;
const { tasks } = model;

test('order', async t => {

   const result = await tasks
      .select('id', 'keywords', $as("area", "xx"))
      .order({
         "id": "desc",
         "keywords": "desc"
      })
      .limit(3)
      .then(data => {
         return data
      })
      .catch(error => {
         console.log(error)
      })

   t.ok(true)

   // console.log(result)

})