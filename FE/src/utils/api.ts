import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const client = axios.create({
    baseURL: API_BASE,
    withCredentials: true
})

// Add token to request headers if it exists
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

export async function login(credentials: { email: string; password: string }): Promise<any> {
    const res = await client.post('/auth/login', credentials)
    // Store token in localStorage
    if (res.data?.data?.token) {
        localStorage.setItem('authToken', res.data.data.token)
    }
    return res.data
}

export async function register(data: { email: string; password: string }): Promise<any> {
    const res = await client.post('/auth/register', data)
    return res.data
}

export async function getCurrentUser(): Promise<any> {
    const res = await client.get('/auth/me')
    return res.data
}

export async function logout(): Promise<any> {
    const res = await client.post('/auth/logout')
    // Clear token from localStorage
    localStorage.removeItem('authToken')
    return res.data
}

export async function checkEmailUnique(email: string): Promise<{ exists: boolean }> {
    const res = await client.get(`/users/check-email?email=${encodeURIComponent(email)}`)
    return res.data
}

export async function fetchPosts(page = 1, limit = 5): Promise<any[]> {
    const res = await client.get(`/posts?page=${page}&limit=${limit}`)
    return res.data
}

export async function fetchPost(id: string | number): Promise<any> {
    const res = await client.get(`/posts/${id}`)
    return res.data
}

export async function createPost(payload: any): Promise<any> {
    const res = await client.post('/posts', payload)
    return res.data
}

export async function updatePost(id: string | number, payload: any): Promise<any> {
    const res = await client.put(`/posts/${id}`, payload)
    return res.data
}

export async function deletePost(id: string | number): Promise<any> {
    const res = await client.delete(`/posts/${id}`)
    return res.data
}

export async function updateUser(id: string, payload: any): Promise<any> {
    const res = await client.put(`/users/${id}`, payload)
    return res.data
}

export default client
