import axios from 'axios';

// Base URL would be adjusted depending on local environment (e.g. 10.0.2.2 for Android Simulator)
export const axiosClient = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});
