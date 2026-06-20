import API_URL from '../api.js'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Home() {
    const [posts, setPosts] = useState([])
    useEffect(() => {
  fetch(`${API_URL}/posts`)
    .then(res => res.json())
    .then(data => setPosts(data.posts))
}, [])
  return (
  <div>
    <div className="board-header">
      <h1>My Blog</h1>
      <p>Thoughts and ideas</p>
    </div>
    <div className="page">
      {posts.map(post => (
        <div className="post-block" key={post.id}>
          <div className="post-header">
            <Link to={`/posts/${post.id}`} className="post-title">{post.title}</Link>
            <span className="post-author">alisher</span>
            <span className="post-date">{new Date(post.creation_date).toLocaleDateString()}</span>
            <span className="post-no">No.{post.id}</span>
          </div>
          <div className="post-body" style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
  {post.image_url && (
    <img 
      src={post.image_url} 
      style={{width: '120px', height: '120px', objectFit: 'cover', flexShrink: 0}} 
    />
  )}
  <span>{post.content}</span>
</div>
        </div>
      ))}
    </div>
  </div>
)
}

export default Home