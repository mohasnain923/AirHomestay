import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

import { UserContext } from '@/providers/UserProvider';
import { PlaceContext } from '@/providers/PlaceProvider';

import { getItemFromLocalStorage, setItemsInLocalStorage, removeItemFromLocalStorage } from '@/utils';
import axiosInstance from '@/utils/axios';

// USER
export const useAuth = () => {
    return useContext(UserContext);
};

export const useProvideAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = getItemFromLocalStorage('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.error("Error parsing user from localStorage", err);
            }
        }
        setLoading(false);
    }, []);

    const register = async (formData) => {
        const { name, email, password } = formData;

        try {
            // Added leading slash '/'
            const { data } = await axiosInstance.post('/user/register', {
                name,
                email,
                password,
            });
            if (data?.user && data?.token) {
                setUser(data.user);
                setItemsInLocalStorage('user', data.user);
                setItemsInLocalStorage('token', data.token);
            }
            return { success: true, message: 'Registration successful' };
        } catch (error) {
            // Optional chaining to prevent undefined crash
            const message = error.response?.data?.message || error.message || 'Registration failed';
            return { success: false, message };
        }
    };

    const login = async (formData) => {
        const { email, password } = formData;

        try {
            // Added leading slash '/'
            const { data } = await axiosInstance.post('/user/login', {
                email,
                password,
            });
            if (data?.user && data?.token) {
                setUser(data.user);
                setItemsInLocalStorage('user', data.user);
                setItemsInLocalStorage('token', data.token);
            }
            return { success: true, message: 'Login successful' };
        } catch (error) {
            // Optional chaining to prevent undefined crash
            const message = error.response?.data?.message || error.message || 'Login failed';
            return { success: false, message };
        }
    };

    const googleLogin = async (credential) => {
        try {
            const decoded = jwtDecode(credential);
            const fullName = decoded.name || `${decoded.given_name || ''} ${decoded.family_name || ''}`.trim();

            // Added leading slash '/'
            const { data } = await axiosInstance.post('/user/google/login', {
                name: fullName,
                email: decoded.email,
            });
            if (data?.user && data?.token) {
                setUser(data.user);
                setItemsInLocalStorage('user', data.user);
                setItemsInLocalStorage('token', data.token);
            }
            return { success: true, message: 'Login successful' };
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Google Login failed';
            return { success: false, message };
        }
    };

    const logout = async () => {
        try {
            const { data } = await axiosInstance.get('/user/logout');
            if (data?.success) {
                setUser(null);
                removeItemFromLocalStorage('user');
                removeItemFromLocalStorage('token');
            }
            return { success: true, message: 'Logout successful' };
        } catch (error) {
            console.log(error);
            return { success: false, message: 'Something went wrong!' };
        }
    };

    const uploadPicture = async (picture) => {
        try {
            const formData = new FormData();
            formData.append('picture', picture);
            const { data } = await axiosInstance.post('/user/upload-picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data;
        } catch (error) {
            console.log(error);
        }
    };

    const updateUser = async (userDetails) => {
        const { name, password, picture } = userDetails;
        const storedUser = getItemFromLocalStorage('user');
        const email = storedUser ? JSON.parse(storedUser)?.email : user?.email;

        try {
            const { data } = await axiosInstance.put('/user/update-user', {
                name, password, email, picture
            });
            return data;
        } catch (error) {
            console.log(error);
        }
    };

    return {
        user,
        setUser,
        register,
        login,
        googleLogin,
        logout,
        loading,
        uploadPicture,
        updateUser
    };
};

// PLACES
export const usePlaces = () => {
    return useContext(PlaceContext);
};

export const useProvidePlaces = () => {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    const getPlaces = async () => {
        try {
            const { data } = await axiosInstance.get('/places');
            setPlaces(data?.places || []);
        } catch (err) {
            console.error("Failed to fetch places", err);
    
        }
        finally {
            setLoading(false);
        }
    
    };


    useEffect(() => {
        getPlaces();
    }, []);

    return {
        places,
        setPlaces,
        loading,
        setLoading
    };
};
