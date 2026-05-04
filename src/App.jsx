import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Todo from './pages/Todo.jsx'
import ProtectedRoute from './components/Protected.jsx'

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/login' />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/todos' element={
        <ProtectedRoute>
          <Todo />
        </ProtectedRoute>
      } />
    </Routes>
  )
}