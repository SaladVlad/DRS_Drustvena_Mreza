import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const token = sessionStorage.getItem('token')

axios.defaults.headers.common = { Authorization: `Bearer ${token}` }
