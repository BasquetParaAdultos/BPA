import axios from './axios'


export const registerRequest = user => axios.post(`/register`, user)

export const loginRequest = user => axios.post(`/login`, user, { withCredentials: true })

export const verityTokenRequest = () => axios.get('/verify', { withCredentials: true })