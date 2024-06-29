const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
   
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },  
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Ensure the reference is correct
        required: true,
      }

}, { timestamps: true });

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

module.exports = Blog;