import axios from 'axios';

// We create a custom Axios instance instead of using the default one.
// Why? Because we want to automatically send our HTTP-Only cookies with EVERY request
// and we want all requests to automatically go to 'http://localhost:3000/api'.
export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // This is the magic flag that includes cookies!
});
