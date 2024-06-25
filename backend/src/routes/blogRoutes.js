const express = require("express");
const blogRoute = express.Router();
const Blog=require("../models/blogModel");


blogRoute.post('/posts', async (req, res)=> {
     
    const blogData=req.body;
    
    try {
        if(blogData.tittle ==="" && blogData.description==="" ){
            return res.status(400).json({message:"Please provide title and description"})
        }
        const blog = new Blog({
            title: blogData.title,
            content: blogData.description,
        });

        await blog.save();
        res.status(201).json({message:"Blog created successfully", blog: blog});
        
    } catch (error) {
        res.status(500).json({message:"Something went wrong", error: error.message});
        
    }

    
});


module.exports =blogRoute