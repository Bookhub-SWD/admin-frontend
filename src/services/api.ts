import axios from 'axios';
import { supabase } from './supabase';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 20000, // 20s timeout
});

// Interceptor to add Supabase token to requests
api.interceptors.request.use(async (config) => {
    try {
        // Supabase getSession is generally fast enough if the session is already established
        // We rely on ProtectedRoute to have secured the perimeter.
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
            console.warn(`API: Supabase auth error for ${config.url}:`, error.message);
        }

        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
        } else {
            console.warn(`API: No active session token found for request to ${config.url}`);
        }
    } catch (err: any) {
        console.error(`API: Interceptor error for ${config.url}:`, err.message);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
