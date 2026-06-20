import API_URL from '../api.js'
import { useState } from 'react'

function CreatePost() {
    
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [message, setMessage] = useState('')
  const [file, setFile] = useState(null)

    const handleSubmit = async () => {
  const formData = new FormData()
  formData.append('title', title)
  formData.append('content', content)
  if (file) formData.append('image', file)

  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
  })
  const data = await response.json()
  if (response.ok) {
    setMessage('Post created successfully!')
  } else {
    setMessage(data.error)
  }
}
  return (
  <div className="page" style={{maxWidth: '600px'}}>
    <div className="post-block">
      <div className="post-header">
        <span className="post-title">Create Post</span>
      </div>
      <div className="post-body">
        <div className="form-block" style={{border: 'none', padding: '0'}}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button onClick={handleSubmit}>Post</button>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  </div>
)
}

export default CreatePost