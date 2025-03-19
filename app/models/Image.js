const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Image = sequelize.define('Image', {
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  mimetype: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

Image.belongsTo(User, { foreignKey: 'userId' });

module.exports = Image;
