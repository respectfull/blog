import API_URL from '../api.js'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

function Post() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
  fetch(`${API_URL}/posts/${id}`)
    .then(res => res.json())
    .then(data => setPost(data.posts))

  fetch(`${API_URL}/posts/${id}/comments`)
    .then(res => res.json())
    .then(data => setComments(data.comments))

  fetch(`${API_URL}/posts/${id}/likes`)
  .then(res => res.json())
  .then(data => setLikes(data.likes))  
  }, [])
  const [newComment, setNewComment] = useState('')

    const handleComment = async () => {
  await fetch(`${API_URL}/posts/${id}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ content: newComment })
  })
  setNewComment('')
  
  // reload comments
  fetch(`${API_URL}/posts/${id}/comments`)
    .then(res => res.json())
    .then(data => setComments(data.comments))
}
    const handleLike = async () => {
  const res = await fetch(`${API_URL}/posts/${id}/likes`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  })
  const data = await res.json()
  setLiked(data.liked)
  setLikes(prev => data.liked ? parseInt(prev) + 1 : parseInt(prev) - 1)
}
   if (!post) return <p>Loading...</p>
return (
  <div className="page">
    <div className="post-block">
      <div className="post-header">
        <span className="post-title">{post.title}</span>
        <span className="post-author">alisher</span>
        <span className="post-date">{new Date(post.creation_date).toLocaleDateString()}</span>
        <span className="post-no">No.{post.id}</span>
      </div>
      <div className="post-body">
  {post.image_url && (
    <img 
      src={post.image_url} 
      style={{maxWidth: '400px', display: 'block', marginBottom: '10px'}} 
    />
  )}
  <span>{post.content}</span>
</div>
      <div className="post-footer">
        <button onClick={handleLike}>{liked ? '❤️' : '🤍'} {likes}</button>
      </div>
    </div>

    <div className="post-block">
      <div className="post-header">
        <span className="post-title">Comments</span>
      </div>
      {comments.map(comment => (
        <div className="reply-block" key={comment.id}>
          <div className="reply-header">
            <img src={comment.avatar_url || 'https://via.placeholder.com/28'} />
            <span className="post-author">{comment.nickname}</span>
          </div>
          <div className="reply-body">{comment.content}</div>
        </div>
      ))}
      <div className="form-block" style={{margin: '8px', border: 'none'}}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button onClick={handleComment}>Submit</button>
      </div>
    </div>
  </div>
)
}

export default Post