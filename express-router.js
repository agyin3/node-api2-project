const express = require('express')
const db = require('./data/db.js')

const router = express.Router()

router.get('/', (req,res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts) 
        })
        .catch(err => {
            res.status(500).json({error: "The posts information could not be retrieved."})
        })
})

router.post('/', (req,res) => {
    const postInfo = req.body
    let newPostId
    postInfo.title && postInfo.contents ? 
    db.insert(postInfo)
        .then(post => {
            newPostId = post.id
        })
        .then(() => {
            db.findById(newPostId)
                .then(post => {
                    res.status(200).json({message: 'Post successfully added', post: post[0]})
                })
        })
        .catch(err => {
            res.status(500).json({error: "There was an error while saving the post to the database"})
        }) :
    res.status(400).json({errorMessage: "Please provide title and contents for the post." })
})

router.post('/:id/comments', (req,res) => {
    //404 not working
    const commentInfo = {...req.body, post_id: req.params.id}
    let commentId
    commentInfo.text ? 
    db.insertComment(commentInfo)
        .then(comment => {
            if(comment) {
                commentId = comment.id
            }else{
                res.status(404).json({message: "The post with the specified ID does not exist."})
            }
        })
        .then(() => {
            db.findCommentById(commentId)
                .then(comment => {
                    res.status(201).json({message: 'Comment successfully added', comment: comment[0]})
                }) 
        })
        .catch(err => {
            res.status(500).json({error: "There was an error while saving the comment to the database"})
        }) :
        res.status(400).json({errorMessage: "Please provide text for the comment."})
})

router.get('/:id', (req,res) => {
    const { id } = req.params
    db.findById(id)
        .then(post => {
            post.length > 0 ? 
            res.status(200).json(post[0]) :
            res.status(404).json({message: "The post with the specified ID does not exist."})
        })
        .catch(err => {
            res.status(500).json({error: "The post information could not be retrieved."})
        })
})

router.get('/:id/comments', (req, res) => {
    const { id } = req.params
    db.findPostComments(id)
        .then(comments => {
            comments.length > 0 ?
            res.status(200).json(comments) :
            res.status(404).json({message: 'The post with the specified ID does not exist.'})
        })
        .catch(err => {
            res.status(500).json({error: "The comments information could not be retrieved." })
        })
})

router.delete('/:id', (req, res) => {
    let deletedPost
    db.findById(req.params.id)
        .then(post => {
            if(!post){
                res.status(404).json({message: 'The post with the specified ID does not exist.'})
            }else {
                deletedPost = post
            }
        })
        .then(() => {
            db.remove(req.params.id)
            .then(
                res.status(200).json({message: 'The post was successfully deleted', deletedPost})
            )
        })
        .catch(err => {
            res.status(500).json({message: 'There was an error deleting your message'})
        })
})

router.put('/:id', (req, res) => {
    const { id } = req.params
    const postInfo = req.body
    let newPost
    postInfo.title && postInfo.contents ? 
    db.update(id, postInfo)
        .then(post => {
            if(!post) {
                res.status(404).json({message: 'The post with the specified ID does not exist.'})
            }
        })
        .then(() => {
            db.findById(id)
                .then(updatedPost => {
                    console.log(updatedPost)
                    res.status(200).json(updatedPost[0])
                })
        })
        .catch(err => {
            res.status(500).json({message: 'There was an error updating your post'})
        }) :
        res.status(400).json({errorMessage: 'Please provide title and contents for the post.'})
})

module.exports = router