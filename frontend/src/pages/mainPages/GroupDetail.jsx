import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { groupsAPI, usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../config/constants';
import { formatSocialNumber } from '../../utils/formatNumbers';

// Icons
import backArrow from '../../assets/icons/dropdown.png';
import members from '../../assets/icons/members.png';
import posts from '../../assets/icons/posts.png';
import settings from '../../assets/icons/settings.png';
import share from '../../assets/icons/share.png';
import defaultGroupIcon from '../../assets/icons/group.png';
import defaultAdminIcon from '../../../public/user1.jpeg'
import notification from '../../assets/icons/notify.png'
import folder from '../../assets/icons/folder.png'

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
    const [admins, setAdmins] = useState([]);
    const [followingInProgress, setFollowingInProgress] = useState([]);
    const [relatedGroups, setRelatedGroups] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');

    const getPrivacyClass = (privacy) => {
        switch (privacy) {
            case 'public':
                return 'bg-green-900/50 text-green-400 border border-green-400';
            case 'private':
                return 'bg-yellow/50 text-yellow border border-yellow';
            case 'hidden':
                return 'bg-red00/50 text-red000 border border-red000';
            default:
                return 'bg-dark700 text-border border-border02';
        }
    };

    const fetchGroup = useCallback(async (signal) => {
        try {
            setLoading(true);
            setError(null);
            const response = await groupsAPI.getGroup(groupId, { signal });
            const groupData = response.data;
            setGroup(groupData);
            setAdmins(groupData.admins || []);
            
            if (user && groupData && groupData.current_user_membership) {
                setUserMembership(groupData.current_user_membership);
            } else {
                setUserMembership(null);
            }
            // Fetch related groups once the main group data is available
            if (groupData.category) {
                fetchRelatedGroups(groupData.category.id, groupData.id);
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

    const fetchRelatedGroups = async (categoryId, currentGroupId) => {
        try {
            const params = {
                category: categoryId,
                exclude: currentGroupId, // Exclude the current group
                page_size: 5 // Limit to 5 related groups
            };
            const response = await groupsAPI.getGroups(params);
            setRelatedGroups(response.data.results);
        } catch (err) {
            console.error('Error fetching related groups:', err);
        }
    };

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

    const handleFollowToggle = async (userId, isFollowing) => {
        setFollowingInProgress(prev => [...prev, userId]);
        try {
            if (isFollowing) {
                await usersAPI.unfollowUser(userId);
            } else {
                await usersAPI.followUser(userId);
            }
            // Manually update the admins state to reflect the change
            setAdmins(prevAdmins => 
                prevAdmins.map(admin => {
                    if (admin.user.id === userId) {
                        return {
                            ...admin,
                            user: {
                                ...admin.user,
                                is_following: !isFollowing,
                                follower_count: isFollowing 
                                    ? admin.user.follower_count - 1 
                                    : admin.user.follower_count + 1
                            }
                        };
                    }
                    return admin;
                })
            );
        } catch (err) {
            console.error('Error toggling follow:', err.response ? err.response.data : err);
            setError('Failed to update follow status. Please try again.');
        } finally {
            setFollowingInProgress(prev => prev.filter(id => id !== userId));
        }
    };

    if (loading) {
        return (
            <main className='flex flex-col items-start gap-3 w-full min-h-screen pt-[90px] bg-dark900'>
                <div className="w-[95%] mx-auto gap-0 flex flex-col items-start justify-start animate-pulse">
                    {/* Header */}
                    <div className="flex items-center justify-between w-full m-1">
                        <div className="flex items-center gap-4 px-0">
                            <div className="w-12 h-12 bg-dark700 rounded-md"></div>
                            <div className="w-48 h-8 bg-dark700 rounded-md"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-24 h-10 bg-dark700 rounded-md"></div>
                            <div className="w-24 h-10 bg-dark700 rounded-md"></div>
                        </div>
                    </div>
                    {/* Group Info */}
                    <div className="w-full flex items-start justify-between gap-2 mt-2">
                        <div className="infoleft p-2 w-[75%] flex-col gap-2 flex">
                            <div className="w-full flex items-start justify-start gap-4">
                                <div className="w-40 h-40 bg-dark700 rounded-sm"></div>
                                <div className="flex-1 flex-col flex gap-2">
                                    <div className="w-3/4 h-12 bg-dark700 rounded-md"></div>
                                    <div className="w-1/2 h-6 bg-dark700 rounded-md"></div>
                                    <div className="w-1/4 h-6 bg-dark700 rounded-md"></div>
                                    <div className="mt-4 w-full h-24 bg-dark700 rounded-md"></div>
                                </div>
                            </div>
                            <div className="w-full mt-4">
                                <div className="w-1/3 h-8 mb-2 bg-dark700 rounded-md"></div>
                                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="w-full h-16 bg-dark700 rounded-md"></div>
                                    <div className="w-full h-16 bg-dark700 rounded-md"></div>
                                    <div className="w-full h-16 bg-dark700 rounded-md"></div>
                                </div>
                            </div>
                        </div>
                        <div className="inforight w-[25%] bg-dark800 border border-border02 rounded-md p-4 h-fit">
                            <div className="w-1/2 h-8 mb-3 bg-dark700 rounded-md"></div>
                            <div className="flex flex-col gap-2">
                                <div className="w-3/4 h-6 bg-dark700 rounded-md"></div>
                                <div className="w-3/4 h-6 bg-dark700 rounded-md"></div>
                            </div>
                            <div className="mt-4 w-full h-12 bg-dark700 rounded-md"></div>
                        </div>
                    </div>
                </div>
            </main>
        );
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
        <main className='flex flex-col items-start gap-3 w-full min-h-screen pt-[90px] px-2 bg-dark900'>
            <div className="w-full md:w-[95%] mx-auto gap-0 flex flex-col items-start justify-start">
                {/* Header */}
                <div className="flex items-center justify-between w-full m-1">
                    <div className="flex items-center gap-4 px-0">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center p-2 transition-all duration-300 border rounded-md border-border02 hover:border-electric"
                        >
                            <img src={backArrow} alt="Back" className="w-5 h-auto rotate-90" />
                        </button>
                        <h1 className="text-2xl hidden md:block font-bold text-white capitalize">{group.name}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded-md text-sm font-semibold capitalize ${getPrivacyClass(group.privacy)}`}>
                                {group.privacy}
                            </span>
                        </div>
                    </div>
                    
                    {/* settings if admin */}
                    <div className="flex items-center gap-2">
                        {/* leavng or joinin group */}
                    <div className="border rounded-md">
                            {!user ? (
                                <Link
                                    to={ROUTES.login}
                                    className="flex items-center justify-center w-full p-1 text-white transition-all duration-300 border rounded-md bg-electric border-electric hover:bg-electric/90"
                                >
                                    Login to Join
                                </Link>
                            ) : isMember ? (
                                <button
                                    onClick={handleLeaveGroup}
                                    disabled={leaving}
                                    className="flex items-center justify-center w-full p-1 text-white transition-all duration-300 border rounded-md border-red-500 hover:bg-red-500/20 disabled:opacity-50"
                                >
                                    {leaving ? 'Leaving...' : 'Leave Group'}
                                </button>
                            ) : isPending ? (
                                <div className="p-1 text-center text-yellow-400 bg-yellow-900/20 border border-yellow-500 rounded-md">
                                    Request Pending
                                </div>
                            ) : canJoin ? (
                                <button
                                    onClick={handleJoinGroup}
                                    disabled={joining}
                                    className="flex items-center justify-center w-full p-1 text-white transition-all duration-300 border rounded-md bg-electric border-electric hover:bg-electric/90 disabled:opacity-50"
                                >
                                    {joining ? 'Joining...' : 'Join Group'}
                                </button>
                            ) : (
                                <div className="p-1 text-center text-border bg-dark700 border border-border02 rounded-md">
                                    Invite Only
                                </div>
                            )}
                    </div> 
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
                <div className="w-full flex  lg:flex-row items-start justify-between gap-4 flex-col p-2 px-0">
                    <div className="infoleft w-full lg:w-[75%] flex-col gap-2 flex">
                        {/* .groupheader */}
                        <div className="w-full flex flex-row md:flex-row items-start justify-start gap-2 md:gap-4">
                            <div className="icon">
                                <img
                                    src={group.group_icon || defaultGroupIcon}
                                    alt={group.name}
                                    className="w-[70px] md:w-40 h-auto rounded-sm object-cover"
                                    onError={(e) => {
                                        e.target.src = defaultGroupIcon;
                                    }}
                                />
                            </div>
                            <div className="flex-1 flex-col flex gap-0 md:mt-0">
                                <h2 className="md:text-4xl text-2xl lg:text-5xl font-bold text-white capitalize">{group.name}</h2>
                                {group.category && (
                                    <p className="md:text-lg text-md text-electric">{group.category.name}</p>
                                )}
                                 {/* Description */}
                             <div>
                                <h3 className="mb-0 text-md md:text-lg font-semibold text-white">About</h3>
                                <p className="text-border text-md">{group.description || 'No description available.'}</p>
                            </div> 
                            </div>
                            
                        </div>
                        {/* stats */}
                        <div className="w-full flex items-center justify-between">
                            <div className="stat flex p-2 bg-dark800 rounded-md items-center justify-between gap-2 md:px-4 md:w-[15%]">
                                <h1 className="text-electric font-bold capitalize text-sm">members</h1>
                                <h2 className="text-electric font-bold capitlize">{formatSocialNumber(group.member_count || 0)}</h2>
                            </div>
                            <div className="stat flex p-2 bg-dark800 rounded-md items-center justify-between gap-2 md:px-4 md:w-[15%]">
                                <h1 className="text-electric font-bold capitalize text-sm">upvotes</h1>
                                <h2 className="text-electric font-bold capitlize">{formatSocialNumber(group.posts_count || 0)}</h2>
                            </div>
                            <div className="stat flex p-2 bg-dark800 rounded-md items-center justify-between gap-2 md:px-4 md:w-[15%]">
                                <h1 className="text-electric font-bold capitalize text-sm">posts</h1>
                                <h2 className="text-electric font-bold capitlize">{formatSocialNumber(group.upvtes_count || 0)}</h2>
                            </div>
                            <div className="stat flex p-2 bg-dark800 rounded-md items-center justify-between gap-2 md:px-4 md:w-[15%]">
                                <h1 className="text-electric font-bold capitalize text-sm">views</h1>
                                <h2 className="text-electric font-bold capitlize">{formatSocialNumber(group.views_count || 0)}</h2>
                            </div>
                        </div>
                        {/* admins */}
                        <div className="w-full flex flex-col items-start justify-start mt-4">
                            <h3 className="text-lg font-semibold text-white mb-2">Admins & Moderators</h3>
                            <div className="w-full grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 border border-border02 bg-dark800 p-2 rounded-md">
                                {admins.map((admin) => (
                                    <div key={admin.id} className="flex group pointer relative items-center gap-3 p-3 rounded-md bg-dark800 border border-border02">
                                        <img
                                            src={admin.user.profile_picture || defaultAdminIcon}
                                            alt={admin.user.username}
                                            className="w-12 h-12 rounded-full object-cover"
                                            onError={(e) => { e.target.src = defaultGroupIcon; }}
                                        />
                                        <div className="flex flex-col gap-1">
                                            <p className="text-white font-semibold text-[12px] md:text-lg ">{admin.user.first_name} {admin.user.last_name}</p>
                                            <span className={`text-md p-1 text-center rounded-md ${admin.is_creator ? 'text-purple border border-purple ' : 'text-electric border-electric border'}`}>
                                                {admin.is_creator ? 'Creator' : 'Admin'}
                                            </span>
                                        </div>

                                        <div className="absolute p-1 left-0 right-0 bottom-0 border flex flex-col gap-2 border-electric rounded-md h-[250px] backdrop-blur-sm z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:scale-105">
                                            <div className="contents w-full">
                                                <div className="admin-pic relative mx-auto w-[85%] h-[100px]">
                                                    <img
                                                        src={admin.user.profile_picture || defaultAdminIcon}
                                                        alt={admin.user.username}
                                                        className="w-full h-[200px] rounded-md border border-electric object-cover absolute bottom-0"
                                                        onError={(e) => { e.target.src = defaultGroupIcon; }}
                                                    />
                                                </div>
                                                <div className="flex-grow w-full skills flex items-center justify-center flex-wrap">
                                                    <p className="text-border text-xs capitalize text-center">
                                                        {admin.user.interests?.length > 0
                                                            ? admin.user.interests.slice(0, 4).map(i => i.topic.name).join(' | ')
                                                            : 'No interests specified'}
                                                    </p>
                                                </div>
                                                <div className="stats w-full flex items-center justify-between gap-1 flex-wrap">
                                                    <div className="flex items-center flex-col gap-0 p-1 bg-dark900 rounded-[3px] px-1">
                                                        <h1 className="text-electric text-[10px] text mb-[-5px]">0</h1>
                                                        <p className="text-border text-[12px] capitalize">posts</p>
                                                    </div>
                                                    <div className="flex items-center flex-col gap-0 p-1 bg-dark900 rounded-[3px] px-1">
                                                        <h1 className="text-electric text-[10px] text mb-[-5px]">0</h1>
                                                        <p className="text-border text-[12px] capitalize">upvotes</p>
                                                    </div>
                                                    <div className="flex items-center flex-col gap-0 p-1 bg-dark900 rounded-[3px] px-1">
                                                        <h1 className="text-electric text-[10px] text mb-[-5px]">{admin.user.follower_count}</h1>
                                                        <p className="text-border text-[12px] capitalize">followers</p>
                                                    </div>
                                                    <div className="flex items-center flex-col gap-0 p-1 bg-dark900 rounded-[3px] px-1">
                                                        <h1 className="text-electric text-[10px] text mb-[-5px]">{admin.user.following_count}</h1>
                                                        <p className="text-border text-[12px] capitalize">following</p>
                                                    </div>
                                                </div>
                                                <div className="btns w-full flex items-center justify-between gap-1 ">
                                                    <button className="border w-1/2 border-border p-2 text-center text-md text-white capitalize transition-all duration-300 rounded-sm bg-dark900 hover:bg-dark900/20">
                                                        message
                                                    </button>
                                                    {user && user.id !== admin.user.id && (
                                                        <button 
                                                            className={`border w-1/2 p-2 text-center text-md text-white capitalize transition-all duration-300 rounded-sm hover:bg-electric/20 ${
                                                                admin.user.is_following 
                                                                    ? 'bg-transparent border-electric text-electric' 
                                                                    : 'bg-electric border-electric hover:bg-electric/80'
                                                            }`}
                                                            onClick={() => handleFollowToggle(admin.user.id, admin.user.is_following)}
                                                            disabled={followingInProgress.includes(admin.user.id)}
                                                        >
                                                            {followingInProgress.includes(admin.user.id)
                                                                ? '...'
                                                                : admin.user.is_following
                                                                ? 'Following'
                                                                : 'Follow'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="inforight w-full lg:w-[25%] flex flex-col gap-2">
                        <div className='w-full flex-grow'>
                            <div className="p-4 bg-dark800 border border-border02 rounded-md flex flex-col gap-2">
                                    <h1 className="text-white font-semibold mb-1">Related Groups</h1>
                                    {relatedGroups.length > 0 ? (
                                        relatedGroups.slice(0, 3).map(group => (
                                            <div className="group w-full flex items-center justify-between gap-2" key={group.id}>
                                                <div className="group-detail flex items-center justify-start gap-2">
                                                    <img src={group.group_icon || defaultGroupIcon} alt={group.name} className='w-10 h-10 rounded-md object-cover'/>
                                                    <div className="flex-col flex gap-0 items-start justify-start">
                                                        <h1 className="text-white text-md capitalize font-bold">{group.name}</h1>
                                                        <p className="text-border text-sm">{formatSocialNumber(group.member_count)} members</p>
                                                    </div>
                                                </div>
                                                <Link to={`/groups/${group.id}`} className='text-electric capitalize text-md'>view</Link>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-border text-sm">No related groups found.</p>
                                    )}
                            </div>
                        </div>
                        <div className="p-4 bg-dark800 border border-border02 rounded-md flex flex-col gap-3 mt-4">
                            <div className="create-post w-full">
                                <Link to={ROUTES.groupCreate} className="w-full block bg-electric text-center text-white p-3 rounded-md transition-all duration-300 capitalize hover:bg-blue-900">create post</Link>
                            </div>
                            <div className="otheroptions w-full flex items-center justify-between gap-2">
                                <Link to="" className="w-1/2 p-2 border border-white text-white rounded-md flex items-center justify-center gap-2 hover:border-electric hover:text-electric transiton-all duration-300">
                                    <img src={notification} alt="" className='w-6 h-auto'/>
                                    Notifications
                                </Link>
                                <Link to="" className="w-1/2 p-2 border border-white text-white rounded-md flex items-center justify-center gap-2 hover:border-electric hover:text-electric transiton-all duration-300">
                                    <img src={folder} alt="" className='w-6 h-auto'/>
                                    shared files
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="groupnav w-full flex items-center justify-between md:justify-start lg:gap-10 mt-3 px-0 relative">
                    <Link 
                        to="" 
                        onClick={() => setActiveTab('posts')}
                        className={`capitalize text-md transition-all duration-300 relative ${
                            activeTab === 'posts' ? 'text-electric' : 'text-border hover:text-white'
                        }`}
                    >
                        posts
                        {activeTab === 'posts' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-electric transform scale-x-100 transition-all duration-300"></div>
                        )}
                    </Link>
                    <Link 
                        to="" 
                        onClick={() => setActiveTab('articles')}
                        className={`capitalize text-md transition-all duration-300 relative ${
                            activeTab === 'articles' ? 'text-electric' : 'text-border hover:text-white'
                        }`}
                    >
                        articles
                        {activeTab === 'articles' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-electric transform scale-x-100 transition-all duration-300"></div>
                        )}
                    </Link>
                    <Link 
                        to="" 
                        onClick={() => setActiveTab('events')}
                        className={`capitalize text-md transition-all duration-300 relative ${
                            activeTab === 'events' ? 'text-electric' : 'text-border hover:text-white'
                        }`}
                    >
                        group events
                        {activeTab === 'events' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-electric transform scale-x-100 transition-all duration-300"></div>
                        )}
                    </Link>
                    <Link 
                        to="" 
                        onClick={() => setActiveTab('discussions')}
                        className={`capitalize text-md transition-all duration-300 relative ${
                            activeTab === 'discussions' ? 'text-electric' : 'text-border hover:text-white'
                        }`}
                    >
                        Discussions
                        {activeTab === 'discussions' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-electric transform scale-x-100 transition-all duration-300"></div>
                        )}
                    </Link>
                </div>
                <div className="group-contents w-full mt-2">
                    {/* Tab Content */}
                    <div className="w-full">
                        {activeTab === 'posts' && (
                            <div className="w-full p-4 bg-dark800 border border-border02 rounded-md">
                                <h2 className="text-xl font-semibold text-white mb-4">Posts</h2>
                                <p className="text-border text-center py-8">No posts available yet. Be the first to create one!</p>
                            </div>
                        )}

                        {activeTab === 'articles' && (
                            <div className="w-full p-4 bg-dark800 border border-border02 rounded-md">
                                <h2 className="text-xl font-semibold text-white mb-4">Articles</h2>
                                <p className="text-border text-center py-8">No articles available yet.</p>
                            </div>
                        )}

                        {activeTab === 'events' && (
                            <div className="w-full p-4 bg-dark800 border border-border02 rounded-md">
                                <h2 className="text-xl font-semibold text-white mb-4">Group Events</h2>
                                <p className="text-border text-center py-8">No events scheduled yet.</p>
                            </div>
                        )}

                        {activeTab === 'discussions' && (
                            <div className="w-full p-4 bg-dark800 border border-border02 rounded-md">
                                <h2 className="text-xl font-semibold text-white mb-4">Discussions</h2>
                                <p className="text-border text-center py-8">No discussions started yet. Start a conversation!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default GroupDetail; 