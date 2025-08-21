import axios from "axios";
const local = 'http://localhost:50001'
const production = 'https://nimbo-backend-1.onrender.com'

let api_url =''
let mode ='pro'

if (mode === 'pro'){
    api_url =production
} else{
    api_url = local
}

const api = axios.create({
    baseURL : `${api_url}/api`,
    withCredentials: true

})

export default api
