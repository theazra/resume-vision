import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api/index';
import { useUI } from './UIContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const navigate = useNavigate();
    const { showNotification } = useUI();

    const login = async (formData) => {
        try {
            const { data } = await api.signIn(formData);
            localStorage.setItem('profile', JSON.stringify(data));
            setUser(data);
            navigate('/app');
        } catch (error) {
            console.log(error);
            showNotification(error.response?.data?.message || "Prijava neuspješna. Provjerite podatke.", "error");
        }
    };

    const register = async (formData) => {
        try {
            const { data } = await api.signUp(formData);
            localStorage.setItem('profile', JSON.stringify(data));
            setUser(data);
            navigate('/app');
        } catch (error) {
            console.log(error);
            showNotification(error.response?.data?.message || "Registracija neuspješna.", "error");
        }
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
