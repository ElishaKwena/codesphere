import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { groupsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../config/constants';

// Icons
import backArrow from '../../assets/icons/dropdown.png';
import members from '../../assets/icons/members.png';
import posts from '../../assets/icons/posts.png';
import settings from '../../assets/icons/settings.png';
import share from '../../assets/icons/share.png';
import defaultGroupIcon from '../../assets/icons/group.png';

const GroupDetail = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userMembership, setUserMembership] = useState(null);
    const [joining, setJoining] = useState(false);
    const [leaving, setLeaving] = useState(false);

    const fetchGroup = useCallback(async (signal) => {
        try {
            setLoading(true);
            setError(null);
            const response = await groupsAPI.getGroup(groupId, { signal });
            const groupData = response.data;
            setGroup(groupData);
            
            if (user && groupData && groupData.current_user_membership) {
                setUserMembership(groupData.current_user_membership);
            } else {
                setUserMembership(null);
            }
        } catch (err) {
            if (err.name !== 'CanceledError') {
                console.error('Error fetching group:', err);
                setError('Failed to load group details.');
            }
        } finally {
            setLoading(false);
        }
    }, [groupId, user]);

    // Fetch group details
    useEffect(() => {
        const controller = new AbortController();
        fetchGroup(controller.signal);

        return () => {
            controller.abort();
        };
    }, [fetchGroup]);

    // Handle join group
    const handleJoinGroup = async () => {
        try {
            setJoining(true);
            await groupsAPI.joinGroup(groupId);
            await fetchGroup(); // Refresh group data
        } catch (err) {
            console.error('Error joining group:', err.response ? err.response.data : err);
            setError('Failed to join group. Please try again.');
        } finally {
            setJoining(false);
        }
    };

    // Handle leave group
    const handleLeaveGroup = async () => {
        try {
            setLeaving(true);
            await groupsAPI.leaveGroup(groupId);
            await fetchGroup(); // Refresh group data
        } catch (err) {
            console.error('Error leaving group:', err.response ? err.response.data : err);
            setError('Failed to leave group. Please try again.');
        } finally {
            setLeaving(false);
        }
    };

    if (loading) {
        return null;
    }

    if (error || !group) {
        return (
            <main className='flex flex-col items-center justify-center w-full min-h-screen pt-[90px] bg-dark900'>
                <div className="text-red-400 text-xl">{error || 'Group not found'}</div>
                <Link to={ROUTES.groups} className="mt-4 text-electric hover:underline">
                    Back to Groups
                </Link>
            </main>
        );
    }

    const isMember = userMembership?.status === 'approved';
    const isAdmin = userMembership?.role === 'admin' || group.creator === user?.id;
    const canJoin = group.privacy === 'public' || group.privacy === 'private';
    const isPending = userMembership?.status === 'pending';

    return (
        <main className='flex flex-col items-start gap-3 w-full min-h-screen pt-[90px] bg-dark900'>
            <div className="w-[97%] mx-auto gap-4 flex flex-col items-start justify-start">
                {/* Header */}
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center p-2 transition-all duration-300 border rounded-md border-border02 hover:border-electric"
                        >
                            <img src={backArrow} alt="Back" className="w-5 h-auto rotate-90" />
                        </button>
                        <h1 className="text-2xl font-bold text-white">{group.name}</h1>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {isAdmin && (
                            <Link
                                to={`/groups/${groupId}/settings`}
                                className="flex items-center gap-2 p-2 transition-all duration-300 border rounded-md border-border02 hover:border-electric"
                            >
                                <img src={settings} alt="Settings" className="w-5 h-auto" />
                                <span className="text-white text-sm">Settings</span>
                            </Link>
                        )}
                        
                        <button className="flex items-center gap-2 p-2 transition-all duration-300 border rounded-md border-border02 hover:border-electric">
                            <img src={share} alt="Share" className="w-5 h-auto" />
                            <span className="text-white text-sm">Share</span>
                        </button>
                    </div>
                </div>

                {/* Group Info */}
                <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="flex flex-col gap-4 p-6 border rounded-md border-border02 bg-dark800">
                            {/* Group Header */}
                            <div className="flex items-start gap-4">
                                <img
                                    src={group.group_icon || defaultGroupIcon}
                                    alt={group.name}
                                    className="w-20 h-20 rounded-md object-cover"
                                    onError={(e) => {
                                        e.target.src = defaultGroupIcon;
                                    }}
                                />
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-white">{group.name}</h2>
                                    <p className="text-sm text-border capitalize">{group.privacy} group</p>
                                    {group.category && (
                                        <p className="text-sm text-electric">{group.category.name}</p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="mb-2 text-lg font-semibold text-white">About</h3>
                                <p className="text-border">{group.description || 'No description available.'}</p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border02">
                                <div className="flex items-center gap-2">
                                    <img src={members} alt="Members" className="w-5 h-auto" />
                                    <div>
                                        <p className="text-sm text-border">Members</p>
                                        <p className="text-lg font-semibold text-white">{group.member_count || 0}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-border">Views</p>
                                        <p className="text-lg font-semibold text-white">{group.views_count || 0}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <img src={posts} alt="Posts" className="w-5 h-auto" />
                                    <div>
                                        <p className="text-sm text-border">Posts</p>
                                        <p className="text-lg font-semibold text-white">{group.posts_count || 0}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 text-border">
                                        <svg fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-border">Created</p>
                                        <p className="text-lg font-semibold text-white">
                                            {new Date(group.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="flex flex-col gap-4">
                        {/* Join/Leave Button */}
                        <div className="p-4 border rounded-md border-border02 bg-dark800">
                            {!user ? (
                                <Link
                                    to={ROUTES.login}
                                    className="flex items-center justify-center w-full p-3 text-white transition-all duration-300 border rounded-md bg-electric border-electric hover:bg-electric/90"
                                >
                                    Login to Join
                                </Link>
                            ) : isMember ? (
                                <button
                                    onClick={handleLeaveGroup}
                                    disabled={leaving}
                                    className="flex items-center justify-center w-full p-3 text-white transition-all duration-300 border rounded-md border-red-500 hover:bg-red-500/20 disabled:opacity-50"
                                >
                                    {leaving ? 'Leaving...' : 'Leave Group'}
                                </button>
                            ) : isPending ? (
                                <div className="p-3 text-center text-yellow-400 bg-yellow-900/20 border border-yellow-500 rounded-md">
                                    Request Pending
                                </div>
                            ) : canJoin ? (
                                <button
                                    onClick={handleJoinGroup}
                                    disabled={joining}
                                    className="flex items-center justify-center w-full p-3 text-white transition-all duration-300 border rounded-md bg-electric border-electric hover:bg-electric/90 disabled:opacity-50"
                                >
                                    {joining ? 'Joining...' : 'Join Group'}
                                </button>
                            ) : (
                                <div className="p-3 text-center text-border bg-dark700 border border-border02 rounded-md">
                                    Invite Only
                                </div>
                            )}
                        </div>

                        {/* Creator Info */}
                        {group.creator && (
                            <div className="p-4 border rounded-md border-border02 bg-dark800">
                                <h3 className="mb-3 text-lg font-semibold text-white">Created by</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-electric rounded-full flex items-center justify-center">
                                        <span className="text-dark900 font-bold">
                                            {group.creator.username?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{group.creator.username}</p>
                                        <p className="text-sm text-border">{group.creator.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Group Status */}
                        {group.creation_status !== 'approved' && (
                            <div className="p-4 border rounded-md border-yellow-500 bg-yellow-900/20">
                                <h3 className="mb-2 text-lg font-semibold text-yellow-400">Group Status</h3>
                                <p className="text-sm text-yellow-300 capitalize">
                                    {group.creation_status} - Awaiting approval
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default GroupDetail; 