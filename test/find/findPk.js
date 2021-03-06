'use strict'

const test = require('jmr');
const typea = require('@chewbank/typea');
const { model } = require('../../model/');

const schema = typea({
   id: Number,
   keywords: Object,
})

const { tasks } = model;

test('findPk ', async t => {

   const result = await tasks
      .schema("public")
      .findPk(1)
      .return('id', 'keywords', 'ids')
      .catch(error => {
         const { message } = error;
         return {
            code: 1000,
            message
         }
      })

   // console.log(result);

   const { error, data } = schema.strictVerify(result)

   if (error) {
      throw TypeError(error);
   } else {
      t.ok(data);
   }

})