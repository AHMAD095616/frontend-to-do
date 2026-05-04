import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios.js'

export default function Todos() {
  const navigate = useNavigate()
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const user = JSON.parse(localStorage.getItem('user'))

  // Get all todos when page loads
  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const res = await API.get('/todos', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      })
      setTodos(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const addTodo = async () => {
    if (!title) return
    try {
      const res = await API.post('/todos',
        { title },
        { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }
      )
      setTodos([...todos, res.data])
      setTitle('')
    } catch (error) {
      console.log(error)
    }
  }

  const toggleTodo = async (id) => {
    try {
      const res = await API.put(`/todos/${id}`, {},
        { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }
      )
      setTodos(todos.map(todo => todo._id === id ? res.data : todo))
    } catch (error) {
      console.log(error)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await API.delete(`/todos/${id}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      })
      setTodos(todos.filter(todo => todo._id !== id))
    } catch (error) {
      console.log(error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <h2>My Todos</h2>
          <div>
            <span style={styles.username}>Hi, {user?.name}</span>
            <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {/* Add Todo */}
        <div style={styles.addRow}>
          <input
            style={styles.input}
            placeholder='Add a new todo...'
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
          />
          <button style={styles.addBtn} onClick={addTodo}>Add</button>
        </div>

        {/* Todo List */}
        {todos.length === 0 && (
          <p style={styles.empty}>No todos yet. Add one above!</p>
        )}
        {todos.map(todo => (
          <div key={todo._id} style={styles.todoRow}>
            <span
              onClick={() => toggleTodo(todo._id)}
              style={{
                ...styles.todoText,
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#aaa' : '#333',
                cursor: 'pointer'
              }}
            >
              {todo.completed ? '✅' : '⬜'} {todo.title}
            </span>
            <button
              style={styles.deleteBtn}
              onClick={() => deleteTodo(todo._id)}
            >
              Delete
            </button>
          </div>
        ))}

        {/* Stats */}
        {todos.length > 0 && (
          <p style={styles.stats}>
            {todos.filter(t => t.completed).length} of {todos.length} completed
          </p>
        )}

      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', background: '#f0f2f5', paddingTop: '3rem' },
  card: { background: '#fff', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '500px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  username: { marginRight: '1rem', color: '#666' },
  logoutBtn: { padding: '0.4rem 0.8rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  addRow: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  input: { flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' },
  addBtn: { padding: '0.75rem 1.2rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' },
  todoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0' },
  todoText: { flex: 1, fontSize: '1rem' },
  deleteBtn: { padding: '0.3rem 0.7rem', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  empty: { textAlign: 'center', color: '#aaa', margin: '2rem 0' },
  stats: { textAlign: 'center', color: '#666', marginTop: '1rem', fontSize: '0.9rem' },
}