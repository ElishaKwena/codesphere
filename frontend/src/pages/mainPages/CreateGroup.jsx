import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { groupsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../config/constants';

// Icons
import backArrow from '../../assets/icons/dropdown.png';
import defaultGroupIcon from '../../assets/icons/group.png';

const CreateGroup = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        privacy: 'public',
        category: '',
        group_icon: null
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await groupsAPI.getCategories();
                // Ensure categories is always an array
                const cats = Array.isArray(response.data)
                    ? response.data
                    : (response.data.results || []);
                setCategories(cats);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setCategories([]); // Set empty array on error
            }
        };
        fetchCategories();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle file upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                group_icon: file
            }));
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            setError('Group name is required');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Create FormData for file upload
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('description', formData.description);
            submitData.append('privacy', formData.privacy);
            if (formData.category) {
                submitData.append('category', formData.category);
            }
            if (formData.group_icon) {
                submitData.append('group_icon', formData.group_icon);
            }

            const response = await groupsAPI.createGroup(submitData);
            
            // Redirect to groups list with a success message
            navigate(ROUTES.groups, { 
                state: { 
                    message: 'Your group has been submitted and is pending approval.' 
                } 
            });
        } catch (err) {
            console.error('Error creating group:', err);
            if (err.response && err.response.data) {
                const errorData = err.response.data;
                // Handle DRF validation errors which are objects
                if (typeof errorData === 'object') {
                    const errorMessages = Object.entries(errorData).map(([field, messages]) => {
                        return `${field}: ${messages.join(' ')}`;
                    }).join('\\n');
                    setError(errorMessages);
                } else {
                    // Handle other errors (like a simple string)
                    setError(errorData.error || errorData.detail || 'Failed to create group. Please try again.');
                }
            } else {
                setError('Failed to create group. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <main className='flex flex-col items-center justify-center w-full min-h-screen pt-[90px] bg-dark900'>
                <div className="text-white text-xl">Please login to create a group</div>
                <Link to={ROUTES.login} className="mt-4 text-electric hover:underline">
                    Go to Login
                </Link>
            </main>
        );
    }

    return (
        <main className='flex flex-col items-start gap-3 w-full min-h-screen pt-[90px] bg-dark900'>
            <div className="w-[97%] mx-auto gap-4 flex flex-col items-start justify-start">
                {/* Header */}
                <div className="w-full flex items-center gap-4 fixed mt-0 pt-1 bg-dark900 z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center p-2 transition-all duration-300 border rounded-md border-border02 hover:border-electric"
                    >
                        <img src={backArrow} alt="Back" className="w-5 h-auto rotate-90" />
                    </button>
                    <h1 className="text-2xl font-bold text-white">Create New Group</h1>
                </div>

                {/* Form */}
                <div className="w-full max-w-2xl mx-auto mt-12 pb-10">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 border rounded-md border-border02 bg-dark800">
                        {error && (
                            <div className="p-4 text-left text-red-400 whitespace-pre-wrap bg-red-900/20 border border-red-500 rounded-md">
                                {error}
                            </div>
                        )}

                        {/* Group Icon */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative w-32 h-32 border-2 border-dashed border-border02 rounded-md overflow-hidden">
                                <img
                                    src={previewImage || defaultGroupIcon}
                                    alt="Group Icon"
                                    className="w-full h-full object-cover"
                                />
                                <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="group-icon"
                                />
                            </div>
                            <label htmlFor="group-icon" className="text-sm text-electric cursor-pointer hover:underline">
                                Upload Group Icon
                            </label>
                        </div>

                        {/* Group Name */}
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-white">
                                Group Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full p-3 text-white transition-all duration-300 border rounded-md border-border02 bg-dark700 focus:outline-none focus:border-electric"
                                placeholder="Enter group name"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-white">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full p-3 text-white transition-all duration-300 border rounded-md border-border02 bg-dark700 focus:outline-none focus:border-electric resize-none"
                                placeholder="Describe your group..."
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label htmlFor="category" className="block mb-2 text-sm font-medium text-white">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full p-3 text-white transition-all duration-300 border rounded-md border-border02 bg-dark700 focus:outline-none focus:border-electric"
                            >
                                <option value="">Select a category (optional)</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Privacy */}
                        <div>
                            <label htmlFor="privacy" className="block mb-2 text-sm font-medium text-white">
                                Privacy Setting
                            </label>
                            <select
                                id="privacy"
                                name="privacy"
                                value={formData.privacy}
                                onChange={handleInputChange}
                                className="w-full p-3 text-white transition-all duration-300 border rounded-md border-border02 bg-dark700 focus:outline-none focus:border-electric"
                            >
                                <option value="public">Public - Anyone can join</option>
                                <option value="private">Private - Requires approval</option>
                                <option value="hidden">Hidden - Invite only</option>
                            </select>
                            <p className="mt-1 text-xs text-border">
                                {formData.privacy === 'public' && 'Anyone can find and join this group'}
                                {formData.privacy === 'private' && 'Anyone can find this group, but joining requires approval'}
                                {formData.privacy === 'hidden' && 'This group is hidden and only accessible via invite'}
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex-1 p-3 text-white transition-all duration-300 border rounded-md border-border02 hover:border-electric"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 p-3 text-white transition-all duration-300 border rounded-md bg-electric border-electric hover:bg-electric/90 disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create Group'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default CreateGroup; 