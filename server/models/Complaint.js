const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Complaint = sequelize.define('Complaint', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  category: { type: DataTypes.STRING, allowNull: false },
  latitude: { type: DataTypes.DECIMAL(9,6) },
  longitude: { type: DataTypes.DECIMAL(9,6) },
  ward: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'filed' }
});

module.exports = Complaint;