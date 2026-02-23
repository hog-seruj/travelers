import axios from 'axios';

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// const baseURL = 'http://localhost:3000/api';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const nextServer = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
