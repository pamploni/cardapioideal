import axios from 'axios';

/* const api = axios.create({
  baseURL: 'http://192.168.0.18:3000',
});
 */
const api = axios.create({
  baseURL: 'ec2-54-236-48-132.compute-1.amazonaws.com:3000',
});

export default api;
