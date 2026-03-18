import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data } = await client.get('/users/me');
                    setUser(data);
                } catch (error) {
                    console.error("Auth check failed", error);
                    // Only remove token if it's actually invalid (e.g. 401)
                    if (error.response?.status === 401) {
                        localStorage.removeItem('token');
                        setUser(null);
                    }
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        const formData = new FormData();
        formData.append('username', email); // OAuth2 expects 'username'
        formData.append('password', password);

        const { data } = await client.post('/auth/login', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        localStorage.setItem('token', data.access_token);
        const userResp = await client.get('/users/me');
        setUser(userResp.data);
        return true;
    };

    const register = async (userData) => {
        await client.post('/auth/register', userData);
        return true;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
