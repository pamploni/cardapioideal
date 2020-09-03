import axios from 'axios';

const api = axios.create({
  baseURL: 'http://ec2-54-236-48-132.compute-1.amazonaws.com:3000',
});

export default api;
