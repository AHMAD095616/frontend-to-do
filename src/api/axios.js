import axios from 'axios'

const API = axios.create({
  baseURL: 'https://mern-todo-backend-mongouri.up.railway.app/api',
})

export default API