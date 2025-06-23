import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

const api = axios.create({
    baseURL:`${API_URL}/api/`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true
})

// adding JWT TO REQUESTS
api.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// HANDLING TOKEN REFRESH
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await axios.post(`${API_URL}/api/auth/token/refresh/`, { refresh: refreshToken });
                localStorage.setItem('access_token', response.data.access);
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Topics API functions
export const topicsAPI = {
    // Get all available topics
    getTopics: () => api.get('/auth/topics/'),
    
    // Get user's selected interests
    getUserInterests: () => api.get('/auth/interests/'),
    
    // Save user's selected interests
    saveUserInterests: (topicIds) => api.post('/auth/interests/', { topic_ids: topicIds }),
};

// Groups API functions
export const groupsAPI = {
    // Get all groups with pagination
    getGroups: (params = {}) => api.get('/groups/', { params }),
    
    // Get a specific group by ID
    getGroup: (groupId, config = {}) => api.get(`/groups/${groupId}/`, config),
    
    // Create a new group
    createGroup: (groupData) => api.post('/groups/', groupData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    
    // Update a group
    updateGroup: (groupId, groupData) => api.put(`/groups/${groupId}/`, groupData),
    
    // Delete a group
    deleteGroup: (groupId) => api.delete(`/groups/${groupId}/`),
    
    // Join a group
    joinGroup: (groupId) => api.post(`/groups/${groupId}/join/`),
    
    // Leave a group
    leaveGroup: (groupId) => api.post(`/groups/${groupId}/leave/`),
    
    // Get user's groups
    getUserGroups: (config = {}) => api.get('/user-groups/', config),
    
    // Get group categories
    getCategories: () => api.get('/categories/'),
    
    // Get group invites
    getGroupInvites: (groupId) => api.get(`/groups/${groupId}/invites/`),
    
    // Create group invite
    createGroupInvite: (groupId, inviteData) => api.post(`/groups/${groupId}/invites/create/`, inviteData),
    
    // Accept invite
    acceptInvite: (token) => api.post(`/invites/accept/${token}/`),
    
    // Get group analytics
    getGroupAnalytics: (groupId) => api.get(`/groups/${groupId}/analytics/`),
    
    // Get group events
    getGroupEvents: (groupId) => api.get(`/groups/${groupId}/events/`),
    
    // Create group event
    createGroupEvent: (groupId, eventData) => api.post(`/groups/${groupId}/events/`, eventData),
};

// Users API functions
export const usersAPI = {
    // Follow a user
    followUser: (userId) => api.post('/auth/follow/follow/', { user_id: userId }),
    
    // Unfollow a user
    unfollowUser: (userId) => api.post('/auth/follow/unfollow/', { user_id: userId }),
    
    // Get current user profile
    getCurrentUser: () => api.get('/auth/user/'),
    
    // Update current user profile
    updateProfile: (userData) => api.put('/auth/user/', userData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
};

export default api; 