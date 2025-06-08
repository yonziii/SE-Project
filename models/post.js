// models/post.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  author_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  content: {               // caption
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  privacy: {
    type: DataTypes.ENUM('public', 'friends', 'private'),
    defaultValue: 'public',
    allowNull: false,
  },
  
}, {
  tableName: 'posts',
  timestamps: false,
});

// After defining both models, set up association in server.js or a central index:
// Post.hasMany(Attachment, { foreignKey: 'post_id', as: 'attachments' });

module.exports = Post;
