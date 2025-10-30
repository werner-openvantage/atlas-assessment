import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const client = axios.create({
  baseURL: API_BASE,
  withCredentials: true
})

export async function login(credentials) {
  const res = await client.post('/auth/login', credentials)
  return res.data
}

export async function register(data) {
  const res = await client.post('/auth/register', data)
  return res.data
}

export async function getCurrentUser() {
  const res = await client.get('/auth/me')
  return res.data
}

export async function logout() {
  const res = await client.post('/auth/logout')
  return res.data
}

export async function checkEmailUnique(email) {
  // Assumes backend exposes an endpoint to check email uniqueness
  const res = await client.get(`/users/check-email?email=${encodeURIComponent(email)}`)
  return res.data // expected { exists: boolean }
}

export async function fetchPosts(page = 1, limit = 5) {
  const res = await client.get(`/posts?page=${page}&limit=${limit}`)
  return res.data
}

export async function fetchPost(id) {
  const res = await client.get(`/posts/${id}`)
  return res.data
}

export async function createPost(payload) {
  const res = await client.post('/posts', payload)
  return res.data
}

export async function updatePost(id, payload) {
  const res = await client.put(`/posts/${id}`, payload)
  return res.data
}

export async function deletePost(id) {
  const res = await client.delete(`/posts/${id}`)
  return res.data
}

export default client
