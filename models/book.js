'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.belongsTo(models.Genre)
      Book.hasMany(models.UsersBook)
    }
  }
  Book.init({
    title: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : {
          msg : 'title cannot be null'
        },
        notEmpty : {
          msg : 'title cannot be empty'
        }
      }
    },
    author: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : {
          msg : 'author cannot be null'
        },
        notEmpty : {
          msg : 'author cannot be empty'
        }
      }
    },
    GenreId: {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        notNull : {
          msg : 'Genre cannot be null'
        },
        notEmpty : {
          msg : 'Genre cannot be empty'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};