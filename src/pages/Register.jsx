import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios.js'

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      const res = await API.post('/auth/register', formData)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data))
      navigate('/todos')
    } catch (error) {
      setError(error.response.data.message)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input
          style={styles.input}
          name='name'
          placeholder='Full Name'
          onChange={handleChange}
        />
        <input
          style={styles.input}
          name='email'
          placeholder='Email'
          type='email'
          onChange={handleChange}
        />
        <input
          style={styles.input}
          name='password'
          placeholder='Password'
          type='password'
          onChange={handleChange}
        />
        <button style={styles.button} onClick={handleSubmit}>
          Register
        </button>
        <p style={styles.link}>
          Already have an account? <Link to='/login'>Login</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' },
  card: { background: '#fff', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  title: { marginBottom: '1.5rem', textAlign: 'center' },
  input: { width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' },
  button: { width: '100%', padding: '0.75rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' },
  error: { color: 'red', marginBottom: '1rem', textAlign: 'center' },
  link: { textAlign: 'center', marginTop: '1rem' },
}