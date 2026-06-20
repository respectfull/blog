import API_URL from '../api.js'
import { useState } from 'react'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

    const handleSubmit = async () => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    const data = await response.json()
    if (response.ok) {
    setMessage('Logged in successfully!')
    localStorage.setItem('token', data.token)
    } else {
    setMessage(data.error)
    }
    }
  
  return (
  <div className="page" style={{maxWidth: '400px'}}>
    <div className="post-block">
      <div className="post-header">
        <span className="post-title">Login</span>
      </div>
      <div className="post-body">
        <div className="form-block" style={{border: 'none', padding: '0'}}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
          <button onClick={handleSubmit}>Login</button>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  </div>
)
}

export default Login