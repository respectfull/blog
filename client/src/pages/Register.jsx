import API_URL from '../api.js'
import { useState } from 'react'

function Register() {
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

    const handleSubmit = async () => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, email, password })
    })
    const data = await response.json()
    if (response.ok) {
    setMessage('Registered successfully! Please login.')
    } else {
    setMessage(data.error)
    }
    }
  
  return (
  <div className="page" style={{maxWidth: '400px'}}>
    <div className="post-block">
      <div className="post-header">
        <span className="post-title">Register</span>
      </div>
      <div className="post-body">
        <div className="form-block" style={{border: 'none', padding: '0'}}>
          <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Nickname" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
          <button onClick={handleSubmit}>Register</button>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  </div>
)
}

export default Register