import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'
import { ROUTES } from '../config/constants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Current user:', user); // Debug log
    }, [user]);

    const refreshUser = async () => {
        try {
            const response = await api.get('/auth/user/');
            setUser(response.data);
            return response.data;
        } catch (error) {
            console.error('Error refreshing user data:', error);
            return null;
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access_token')
            if (token) {
                try {
                    api.defaults.headers['Authorization'] = `Bearer ${token}`
                    // verify token validity
                    const response = await api.get('/auth/user/')
                    setUser(response.data)
                    
                    // Check if user needs to complete onboarding
                    if (!response.data.has_completed_onboarding) {
                        navigate(ROUTES.topics);
                    }
                }
                catch (error) {
                    localStorage.removeItem('access_token')
                    localStorage.removeItem('refresh_token')
                    setUser(null)
                }
            }
            setLoading(false);
        };
        initAuth();
    }, [navigate]);

    const register = async (formData) => {
        try {
            const response = await api.post('/auth/register/', formData);
            return {
                success: true,
                data: response.data
            }
            // Just return success without logging in
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data || error.message 
            };
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login/', { email, password })

            // Get user data with the new token
            api.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;

            localStorage.setItem('access_token', response.data.access)
            localStorage.setItem('refresh_token', response.data.refresh)

            
            // get user data
            const UserResponse = await api.get('/auth/user/')
            setUser(UserResponse.data)
            
            // Check if user needs to complete onboarding
            if (!UserResponse.data.has_completed_onboarding) {
                navigate(ROUTES.topics);
            } else {
                navigate('/home');
            }
            
            return { success: true }
        }
        catch (error) {
            // clear tokens on error 
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            throw error.response?.data || { error: 'Login failed. Please check your credentials' }
        }
    };

    const logout = () => {
        try {
            api.post('/auth/logout/', { refresh: localStorage.getItem('refresh_token') })
            localStorage.removeItem('access_token')
        }
        catch (error) {
            console.error('Logout error:', error);
        }
        localStorage.removeItem('acceess_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        return { success: true };
    };

    const updateUser = (userData) => {
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, refreshUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );


};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 