const commentsRouter = require('./routes/comments')
const pool = require('./db')
const express = require('express')
const cors = require('cors')
const postsRouter = require('./routes/posts')
const authRouter = require('./routes/auth')
const app = express()
const likesRouter = require('./routes/likes')

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
// then all routes after

app.use('/posts/:id/likes', likesRouter)

app.use('/auth', authRouter)
app.use('/posts', postsRouter)
app.use('/posts/:id/comments', commentsRouter)

app.get('/', (req, res) => {
  res.send('Server is running!')
})

app.listen(3000, () => {
  console.log('Server started on port 3000')
})

app.get('/test-db', (req, res) => {
  pool.query('SELECT NOW()', (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message })
    } else {
      res.json({ time: result.rows[0] })
    } 
  })
})