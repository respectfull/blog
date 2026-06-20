const express = require('express')
const router = express.Router()
const pool = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/auth')
const upload = require('../middleware/upload')
const cloudinary = require('../cloudinary')

router.post('/register', async (req, res) => {
  const { nickname, email, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  pool.query(
    'INSERT INTO users (nickname, email, password) VALUES ($1, $2, $3)',
    [nickname, email, hashedPassword],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message })
      } else {
        res.status(201).json({ message: 'User registered successfully' })
      }
    }
  )
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  pool.query('SELECT * FROM users WHERE email = $1', [email], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message })

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const user = result.rows[0]

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign(
    { id: user.id, nickname: user.nickname },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
    )

    res.json({ token })
  })
})

router.post('/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: 'avatars' }, (err, result) => {
        if (err) reject(err)
        else resolve(result)
      }).end(req.file.buffer)
    })

    pool.query(
      'UPDATE users SET avatar_url = $1 WHERE id = $2',
      [result.secure_url, req.user.id],
      (err) => {
        if (err) return res.status(500).json({ error: err.message })
        res.json({ avatar_url: result.secure_url })
      }
    )
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router