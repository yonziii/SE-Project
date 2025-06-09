// models/attachment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Attachment = sequelize.define('Attachment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  post_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('image','video','document'),
    allowNull: false,
  },
  file_url: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'attachments',
  timestamps: false,
});

// Association (call after importing Post)
Attachment.associate = (models) => {
  Attachment.belongsTo(models.Post, { foreignKey: 'post_id' });
};

module.exports = Attachment;
