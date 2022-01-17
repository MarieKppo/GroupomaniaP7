const groupomania = require('./Database');

const Post = function(post) {
    this.post_id = post.post_id,
    this.user_id = post.user_id,
    this.content = post.content,
    this.date = post.date
};

module.exports = Post;