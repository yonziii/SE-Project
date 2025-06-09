// controllers/postsController.js
const { Sequelize } = require('sequelize');
const Post = require('../models/post');
const Attachment = require('../models/attachment');
const sequelize = require('../config/db');
/**
 * createPost
 * Expects:
 *   req.body.content          (string, required)
 *   req.body.image_urls       (array of strings, 0–n images)
 *   req.body.video_url        (string|null, at most one)
 *   req.body.document_url     (string|null, at most one)
 */
exports.createPost = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { content, image_urls, video_url, document_url, privacy } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Caption (content) is required.' });
    }
    const authorId = req.user.sub;

    // 1) Create Post
    const post = await Post.create({
      author_id: authorId,
      content: content.trim(),
      privacy: privacy || 'public', // <-- add this line
    }, { transaction: t });

    // 2) Build attachments array
    const attachments = [];
    // multiple images
    if (Array.isArray(image_urls)) {
      image_urls.forEach(url => {
        attachments.push({ post_id: post.id, type: 'image', file_url: url });
      });
    }
    // single video
    if (video_url) {
      attachments.push({ post_id: post.id, type: 'video', file_url: video_url });
    }
    // single document
    if (document_url) {
      attachments.push({ post_id: post.id, type: 'document', file_url: document_url });
    }

    // 3) Bulk insert attachments if any
    if (attachments.length) {
      await Attachment.bulkCreate(attachments, { transaction: t });
    }

    await t.commit();

    // 4) Reload post along with its attachments
    const fullPost = await Post.findByPk(post.id, {
      include: [{ model: Attachment, as: 'attachments' }],
    });

    return res.status(201).json({
      message: 'Post created with attachments.',
      post: fullPost
    });

  } catch (err) {
    await t.rollback();
    next(err);
  }
};

/**
 * listPosts
 * Returns posts with their attachments, newest first
 */
exports.listPosts = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      order: [['created_at', 'DESC']],
      include: [{ model: Attachment, as: 'attachments' }],
    });
    return res.json({ posts });
  } catch (err) {
    next(err);
  }
};
