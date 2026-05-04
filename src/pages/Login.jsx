import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios.js'

export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('') // clear error when user types
  }

  const handleSubmit = async () => {
    // Validation — never trust user input
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)
      setError('')
      const res = await API.post('/auth/login', formData)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data))
      navigate('/todos')
    } catch (error) {
      // Handle different error types professionally
      if (error.response) {
        // Server responded with error
        setError(error.response.data.message || 'Login failed')
      } else if (error.request) {
        // Server not reachable
        setError('Cannot connect to server. Please try again.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>

        {error && (
          <div style={styles.errorBox}>
            ⚠️ {error}
          </div>
        )}

        <input
          style={styles.input}
          name='email'
          placeholder='Email'
          type='email'
          onChange={handleChange}
          disabled={loading}
        />
        <input
          style={styles.input}
          name='password'
          placeholder='Password'
          type='password'
          onChange={handleChange}
          disabled={loading}
        />
        <button
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p style={styles.link}>
          No account? <Link to='/register'>Register</Link>
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
  button: { width: '100%', padding: '0.75rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem' },
  errorBox: { background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  link: { textAlign: 'center', marginTop: '1rem' },
}