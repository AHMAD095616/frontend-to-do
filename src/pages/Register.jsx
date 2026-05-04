import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios.js'

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    if (formData.name.length < 3) {
      setError('Name must be at least 3 characters')
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      setError('')
      const res = await API.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data))
      navigate('/todos')
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Registration failed')
      } else if (error.request) {
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
        <h2 style={styles.title}>Create Account</h2>

        {error && (
          <div style={styles.errorBox}>
            ⚠️ {error}
          </div>
        )}

        <input
          style={styles.input}
          name='name'
          placeholder='Full Name'
          onChange={handleChange}
          disabled={loading}
        />
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
        <input
          style={styles.input}
          name='confirmPassword'
          placeholder='Confirm Password'
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
          {loading ? 'Creating account...' : 'Register'}
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
  button: { width: '100%', padding: '0.75rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem' },
  errorBox: { background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  link: { textAlign: 'center', marginTop: '1rem' },
}