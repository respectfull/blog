const authMiddleware = require('../middleware/auth')
const express = require('express')
const router = express.Router({ mergeParams: true })
const pool = require('../db')

router.get('/', (req, res) => {
    pool.query(
  'SELECT comment.*, users.avatar_url, users.nickname FROM comment JOIN users ON comment.author_id = users.id WHERE comment.post_id = $1',
  [req.params.id],
  (err, result) => { 
        if (err) {
            res.status(500).json({ error: err.message })
        } else {
            res.json({ comments: result.rows })
        }
    })
})

router.post('/', authMiddleware, (req, res) => {
    const { content } = req.body
    pool.query('INSERT INTO comment (content, post_id, author_id) VALUES ($1, $2, $3) RETURNING *',
        [content, req.params.id, req.user.id],
        (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message })
            } else {
                res.json({ message: "Comment posted successfully!" })
            }
        }
    )
})

router.get('/:id', (req, res) => {
    pool.query('SELECT comment.*, users.avatar_url, users.nickname FROM comment JOIN users ON comment.author_id = users.idWHERE comment.post_id = $1 WHERE id = $1', [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message })
        } else {
            if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Comment not found' })
            }
            res.json({ posts: result.rows[0] })
        }
    })
})

module.exports = router