import axios from 'axios';

/* const api = axios.create({
  baseURL: 'http://localhost:5555',
}); */

const api = axios.create({
  baseURL: 'http://ec2-35-153-57-160.compute-1.amazonaws.com:5555',
});

export default api;
