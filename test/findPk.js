'use strict'

const common = require('./common')

async function main() {

   const { tasks } = await common().catch(error => {
      console.log(error)
   })

   const result = await tasks
      .select('id', 'keywords')
      .findPk(6)
      .catch(error => {
         console.log(error)
         const { message } = error
         return {
            code: 1000,
            message
         }
      })

   console.log(result)

}

main().catch(error => {
   console.log(error)
})