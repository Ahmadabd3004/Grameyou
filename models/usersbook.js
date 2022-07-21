'use strict';
const {
  Model
} = require('sequelize');
const dateFormat = require('../helper/dateFormat')
module.exports = (sequelize, DataTypes) => {
  class UsersBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UsersBook.belongsTo(models.User)
      UsersBook.belongsTo(models.Book)
    }
    formatDate(){
      return dateFormat(this.createdAt)
    }
  }
  UsersBook.init({
    UserId: DataTypes.INTEGER,
    BookId: DataTypes.INTEGER,
    timeLeft: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UsersBook',
  });
  return UsersBook;
};