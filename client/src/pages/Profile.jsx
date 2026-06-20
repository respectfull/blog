import API_URL from '../api.js'
import { useState } from 'react'

function Profile() {
  const [file, setFile] = useState(null)
  const [avatar, setAvatar] = useState('')
  const [message, setMessage] = useState('')

  const handleUpload = async () => {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await fetch(`${API_URL}/auth/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    })
    const data = await response.json()
    if (response.ok) {
      setAvatar(data.avatar_url)
      setMessage('Avatar updated!')
    } else {
      setMessage(data.error)
    }
  }

  return (
  <div className="page">
    <div className="post-block">
      <div className="post-header">
        <span className="post-title">Profile</span>
      </div>
      <div className="post-body">
        {avatar && <img src={avatar} width="60" height="60" style={{borderRadius: '50%', marginBottom: '10px', display: 'block'}} />}
        <div className="form-block" style={{border: 'none', padding: '0'}}>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button onClick={handleUpload}>Upload Avatar</button>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  </div>
)
}

export default Profile