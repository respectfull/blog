const cloudinary = require('../cloudinary')
const upload = require('../middleware/upload')
const authMiddleware = require('../middleware/auth')
const express = require('express')
const router = express.Router()
const pool = require('../db')

router.get('/', (req, res) => {
    pool.query('SELECT * FROM post', (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message })
        } else {
            res.json({ posts: result.rows })
        }
    })
})
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  const { title, content } = req.body
  let image_url = null

  if (req.file) {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: 'posts' }, (err, result) => {
        if (err) reject(err)
        else resolve(result)
      }).end(req.file.buffer)
    })
    image_url = result.secure_url
  }

  pool.query(
    'INSERT INTO post (title, content, author_id, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, content, req.user.id, image_url],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ message: 'Post created successfully!' })
    }
  )
})

router.get('/:id', (req, res) => {
    pool.query('SELECT * FROM post WHERE id = $1', [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message })
        } else {
            if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' })
            }
            res.json({ posts: result.rows[0] })
        }
    })
})

module.exports = router