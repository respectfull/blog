const express = require('express')
const router = express.Router({ mergeParams: true })
const pool = require('../db')
const authMiddleware = require('../middleware/auth')

router.post('/', authMiddleware, async (req, res) => {
  // check if like already exists
  pool.query(
    'SELECT * FROM likes WHERE user_id = $1 AND post_id = $2',
    [req.user.id, req.params.id],
    (err, result) => {
      if (result.rows.length > 0) {
        // already liked — unlike it
        pool.query('DELETE FROM likes WHERE user_id = $1 AND post_id = $2',
          [req.user.id, req.params.id],
          (err) => res.json({ liked: false })
        )
      } else {
        // not liked — like it
        pool.query('INSERT INTO likes (user_id, post_id) VALUES ($1, $2)',
          [req.user.id, req.params.id],
          (err) => res.json({ liked: true })
        )
      }
    }
  )
})
router.delete('/', authMiddleware, (req, res) => {
  pool.query(
    'DELETE FROM likes WHERE user_id = $1 AND post_id = $2',
    [req.user.id, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ message: 'Unliked!' })
    }
  )
})

router.get('/', (req, res) => {
  pool.query(
    'SELECT COUNT(*) FROM likes WHERE post_id = $1',
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ likes: result.rows[0].count })
    }
  )
})

module.exports = router