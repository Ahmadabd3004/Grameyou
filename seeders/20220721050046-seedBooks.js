'use strict';
const fs = require('fs')
module.exports = {
   up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     let books = JSON.parse(fs.readFileSync('./books.json','utf-8')).map(el=>{
      delete el.id
      el.createdAt = new Date()
      el.updatedAt = new Date()
      return el
  })
   return queryInterface.bulkInsert('Books',books,{})
  
},

down (queryInterface, Sequelize) {
  /**
   * Add commands to revert seed here.
   *
   * Example:
   * await queryInterface.bulkDelete('People', null, {});
   */
    return queryInterface.bulkDelete('Books',null,{})
  }
};
