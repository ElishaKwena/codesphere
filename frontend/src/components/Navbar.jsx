import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { ROUTES } from '../config/constants'
import { useAuth } from '../context/AuthContext.jsx'
import { groupsAPI } from '../services/api'
import logo from '../assets/icons/logo.png'
import javascript from '../assets/icons/java-script.png'
import python from '../assets/icons/python.png'
import ai from '../assets/icons/artificial.png'
import add from '../assets/icons/interface.png'
import userPlaceholder from '../assets/images/user.png'
import menu from '../assets/icons/menu.png'
import search from '../assets/icons/search.png'
import home from '../assets/icons/home.png'
import explore from '../assets/icons/expolore.png'
import settings from '../assets/icons/settings.png'
import job from '../assets/icons/jobs.png'
import community from '../assets/icons/community.png'
import group from '../assets/icons/group.png'
import dropdown from '../assets/icons/dropdown.png'
import money from '../assets/icons/money.png'
import signout from '../assets/icons/signout.png'
import bookmark from '../assets/icons/bookmark.png'
import notify from '../assets/icons/notify.png'
import addnew from '../assets/icons/add.png'
import close from '../assets/icons/close.png'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const [isExploreOpen, setIsExploreOpen] = useState(false);
    const [isGroupsOpen, setIsGroupsOpen] = useState(false);
    const [isCommunityOpen, setIsCommunityOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAddnewOpen, setIsAddnewOpen] = useState(false);
    const [notifications, setNotifications] = useState(5); // Example notification count
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userGroups, setUserGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(false);

    // Separate refs for dropdowns and sidebar
    const dropdownsRef = useRef(null);
    const sidebarRef = useRef(null);
    const sidebarToggleRef = useRef(null); // NEW: ref for sidebar toggle button

    const { user, logout, refreshUser } = useAuth();
    const navigate = useNavigate();

    // Fetch user's groups
    useEffect(() => {
        const fetchUserGroups = async () => {
            if (user) {
                setLoadingGroups(true);
                try {
                    console.log('Fetching user groups for user:', user.id);
                    const response = await groupsAPI.getUserGroups({ params: { page_size: 3 } });
                    console.log('User groups response:', response.data);
                    setUserGroups(response.data.results || []);
                } catch (error) {
                    console.error("Failed to fetch user groups", error);
                    console.error("Error response:", error.response?.data);
                    console.error("Error status:", error.response?.status);
                    setUserGroups([]);
                } finally {
                    setLoadingGroups(false);
                }
            } else {
                setUserGroups([]);
            }
        };

        fetchUserGroups();
    }, [user]);

    // Dropdown click-outside handler
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownsRef.current && !dropdownsRef.current.contains(event.target)) {
                setIsExploreOpen(false);
                setIsGroupsOpen(false);
                setIsCommunityOpen(false);
                setIsProfileOpen(false);
                setIsAddnewOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sidebar click-outside handler (updated)
    useEffect(() => {
        function handleSidebarClickOutside(event) {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                sidebarToggleRef.current &&
                !sidebarToggleRef.current.contains(event.target)
            ) {
                setSidebarOpen(false);
            }
        }
        if (sidebarOpen) {
            document.addEventListener('mousedown', handleSidebarClickOutside);
        } else {
            document.removeEventListener('mousedown', handleSidebarClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleSidebarClickOutside);
    }, [sidebarOpen]);

    // Toggle functions
    const toggleExplore = () => {
        setIsExploreOpen((prev) => !prev);
        setIsGroupsOpen(false);
        setIsCommunityOpen(false);
        setIsAddnewOpen(false);
        setIsProfileOpen(false);
    };
    const toggleGroups = (e) => {
        e.stopPropagation();
        setIsGroupsOpen((prev) => !prev);
        setIsExploreOpen(false);
        setIsCommunityOpen(false);
        setIsAddnewOpen(false);
        setIsProfileOpen(false);
    };
    const toggleCommunity = () => {
        setIsCommunityOpen((prev) => !prev);
        setIsExploreOpen(false);
        setIsGroupsOpen(false);
        setIsAddnewOpen(false);
        setIsProfileOpen(false);
    };
    const toggleAddnew = () => {
        setIsAddnewOpen((prev) => !prev);
        setIsExploreOpen(false);
        setIsGroupsOpen(false);
        setIsCommunityOpen(false);
        setIsProfileOpen(false);
    };
    const toggleProfile = () => {
        setIsProfileOpen((prev) => !prev);
        setIsExploreOpen(false);
        setIsGroupsOpen(false);
        setIsCommunityOpen(false);
        setIsAddnewOpen(false);
    };
    const toggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
    };

    const handleLogout = async () => {
        await logout();
        navigate(ROUTES.landing);
    };

    return (
        <>
        <header className="w-full p-2 h-[90px] bg-dark900 fixed top-0 left-0 z-50 grid border-b-2 border-border02 overflow-visible ">
            <nav ref={dropdownsRef} className="flex items-center justify-between w-full">
                <div className="flex items-center gap-10 justify-left nav-left">
                    <div className="logo">
                        <Link to={ROUTES.landing} className='flex items-center gap-3 justify-left'>
                            <img src={logo} alt="logo" className='w-[30px] h-[30px] md:w-10 md:h-10' />
                            <h1 className='md:text-2xl text-lg font-bold text-electric md:font-["Impact"] font-["Impac"]'>CodeSphere</h1>
                        </Link>
                    </div>
                    <div className="items-center justify-between hidden gap-6 md:flex menu-items">
                        <div className="menu">
                            <Link to={ROUTES.home} className='text-lg font-semibold text-white font-["Times_New_Roman"] hover:text-electric transition-all duration-3000'>Home</Link>
                        </div>
                        <div className="relative menu">
                            <button 
                                type="button"
                                onClick={toggleExplore}
                                className='text-lg font-semibold text-white font-["Times_New_Roman"] flex items-center justify-center gap-2 relative hover:text-electric transition-all duration-3000'
                            >
                                Explore
                                <img src={dropdown} alt="" className={`w-4 h-4 transition-all duration-300 ${isExploreOpen ? 'rotate-180 !text-electric' : ''}`} />
                            </button>
                            <div className={`absolute left-0 flex flex-col gap-1 border-2 rounded-md z-p10 top-10 border-border02 dropdown-items bg-dark800 overflow-hidden transition-all duration-300 ease-in-out ${isExploreOpen ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <Link to={ROUTES.home} className='text-sm font-semibold text-white font-["Times_New_Roman"] py-2 px-4 pr-24 hover:bg-dark700 transition-all duration-3000'>Articles</Link>    
                                <Link to={ROUTES.home} className='text-sm font-semibold text-white font-["Times_New_Roman"] py-2 px-4 pr-24 hover:bg-dark700 transition-all duration-3000'>Tutorials</Link>        
                                <Link to={ROUTES.home} className='text-sm font-semibold text-white font-["Times_New_Roman"] py-2 px-4 pr-24 hover:bg-dark700 transition-all duration-3000'>Trending</Link>        
                                <Link to={ROUTES.home} className='text-sm font-semibold text-white font-["Times_New_Roman"] py-2 px-4 pr-24 hover:bg-dark700 transition-all duration-3000'>AI Recs</Link>        
                            </div>
                        </div>
                        <div className="relative menu">
                            <button 
                                type="button"
                                onClick={toggleCommunity}
                                className='text-lg font-semibold text-white font-["Times_New_Roman"] flex items-center justify-center gap-2 relative hover:text-electric transition-all duration-3000'
                            >
                                Community
                                <img src={dropdown} alt="" className={`w-4 h-4 transition-all duration-300 ${isCommunityOpen ? 'rotate-180 !text-electric' : ''}`} />
                            </button>
                            <div className={`absolute left-0 flex flex-col gap-1 border-2 rounded-md z-p10 top-10 border-border02 dropdown-items bg-dark800 overflow-hidden transition-all duration-300 ease-in-out ${isCommunityOpen ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <Link to={ROUTES.home} className='text-sm font-semibold text-white font-["Times_New_Roman"] py-2 px-4 pr-16 hover:bg-dark700 transition-all duration-3000'>Q&A Forum</Link>    
                                <Link to={ROUTES.home} className='text-sm text-nowrap font-semibold text-white font-["Times_New_Roman"] py-2 px-4 pr-16 hover:bg-dark700 transition-all duration-3000'>Live Collaboration</Link>        
                                <Link to={ROUTES.home} className='text-sm font-semibold text-white font-["Times_New_Roman"] py-2 px-4 pr-16 hover:bg-dark700 transition-all duration-3000'>Events</Link>        
                                <Link to={ROUTES.home} className='text-sm font-semibold text-white font-["Times_New_Roman"] py-2 px-4 pr-16 hover:bg-dark700 transition-all duration-3000'>Mentorship</Link>        
                            </div>
                        </div>
                        <div className="relative menu">
                            <button 
                                type="button"
                                onClick={toggleGroups}
                                className='text-lg font-semibold text-white font-["Times_New_Roman"] flex items-center justify-center gap-2 relative hover:text-electric transition-all duration-3000'
                            >
                                Groups
                                <img src={dropdown} alt="" className={`w-4 h-4 transition-all duration-300 ${isGroupsOpen ? 'rotate-180 !text-electric' : ''}`} />
                            </button>
                            <div className={`absolute z-50 w-[250px] left-0 flex flex-col gap-0 border-2 rounded-md z-p10 top-10 border-border02 dropdown-items bg-dark800 overflow-hidden transition-all duration-300 ease-in-out ${isGroupsOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="flex items-center p-3 py-1 pr-24 border-b border-b-border02 justify-left top W-full">
                                    <h1 className='text-md font-bold text-border font-["Times_New_Roman"] text-nowrap'>YOUR GROUPS</h1>
                                </div>
                                <div className="flex flex-col items-center w-full gap-0 border-b border-border02 groupbox ">
                                    {loadingGroups ? (
                                        <div className='w-full pl-3 py-2 flex items-center gap-2 text-sm font-semibold text-border font-["Times_New_Roman"]'>
                                            <span>Loading...</span>
                                        </div>
                                    ) : userGroups.length > 0 ? (
                                        userGroups.map(group => (
                                            <Link 
                                                key={group.id}
                                                to={`/groups/${group.id}`} 
                                                className='w-full pl-3 py-2 flex items-center gap-2 text-sm font-semibold text-white font-["Times_New_Roman"] hover:bg-dark700 transition-all duration-3000'
                                            >
                                                <span>
                                                    <img src={group.group_icon || defaultGroupIcon} alt={group.name} className='w-6 h-6 rounded-md object-cover'/>
                                                </span>
                                                <p className='transition-all text-nowrap duration-3000 capitalize'>{group.name}</p>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className='w-full pl-3 py-2 flex items-center gap-2 text-sm font-semibold text-border font-["Times_New_Roman"]'>
                                            <span>No groups joined</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center p-3 py-1 pr-24 border-b border-b-border02 justify-left top W-full">
                                    <h1 className='text-md font-bold text-border font-["Times_New_Roman"] text-nowrap'>DISCOVER</h1>
                                </div>
                                <div className="flex flex-col items-center w-full gap-0 groupbox ">
                                    <Link to={ROUTES.groups} className='text-sm text-nowrap font-semibold text-white font-["Times_New_Roman"] pl-4 py-2 pr-24 rounded-md hover:bg-dark700 transition-all duration-3000 flex items-center justify-left gap-2'>
                                        <img src={logo} alt="" className='w-6 h-6' />
                                        Browse All Groups
                                    </Link>  
                                    <Link to={ROUTES.groupCreate} className='w-full pl-3 py-2 flex items-center gap-2 text-sm font-semibold text-white font-["Times_New_Roman"] hover:bg-dark700 transition-all duration-3000'>
                                        <span>
                                            <img src={add} alt="" className='w-6 h-6'/>
                                        </span>
                                        <p className='transition-all text-nowrap duration-3000'>Create New Group</p>
                                    </Link>  
                                </div>      
                            </div>
                        </div>
                        <div className="menu">
                            <Link to={ROUTES.home} className='text-lg font-semibold text-white font-["Times_New_Roman"] hover:text-electric transition-all duration-3000'>Jobs</Link>
                        </div>
                    </div>
                    <div className="relative w-[500px] seachbar hidden md:block">
                        <form action="" className="relative">
                            <input 
                                type="text" 
                                placeholder='Search codespher...' 
                                className='w-full h-full p-2 pl-10 transition-all duration-300 border-2 rounded-md bg-dark800 border-border02 text-white000 focus:border-electric focus:outline-none' 
                            />
                            <ion-icon 
                                name="search-outline" 
                                className="absolute text-xl -translate-y-1/2 left-3 top-1/2 text-border"
                            ></ion-icon>
                        </form>
                    </div>
                </div>
                <div className="md:w-[15%] flex items-center flex-row gap-4 justify-right md:justify-left nav-right">
                    <div className="menu">
                        <Link to={ROUTES.home} className='relative font-semibold text-white font-["Times_New_Roman"] hover:text-electric transition-all duration-3000'>
                            <img src={bookmark} alt="" className='w-8 h-auto md:w-8' />
                        </Link>
                    </div>
                    <div className="menu">
                        <Link to={ROUTES.home} className='relative text-lg font-semibold text-white font-["Times_New_Roman"] hover:text-electric transition-all duration-3000'>
                            <img src={notify} alt="" className='w-10 h-auto md:w-10' />
                            {notifications > 0 && (
                                <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red000 rounded-full flredex bg -top-[0px] -right-0">
                                    {notifications}
                                </span>
                            )}
                        </Link>
                    </div>
                    <div ref={dropdownsRef} className="flex items-center gap-4">
                        <div className="relative hidden menu md:block">
                            <button 
                                type="button"
                                onClick={toggleAddnew}
                                className='relative flex items-center justify-center transition-all hover:text-electric duration-3000'
                            >
                                <img src={addnew} alt="Add New" className='w-10 h-auto'/>
                            </button>
                            <div className={`absolute left-[-150px] flex flex-col gap-1 border-2 rounded-md z-[100] top-10 border-border02 dropdown-items bg-dark800 transition-all duration-300 ease-in-out ${isAddnewOpen ? 'max-h-[200px] opacity-100 pointer-events-auto' : 'pointer-events-none max-h-0 opacity-0'}`}>
                                <Link to={ROUTES.home} className='text-sm font-semibold text-white font-["Times_New_Roman"] py-2 px-4 pr-24 hover:bg-dark700 transition-all duration-3000 flex items-center gap-2'>
                                    New Post
                                </Link>    
                                <Link to={ROUTES.home} className=' text-nowrap text-sm font-semibold text-white font-["Times_New_Roman"] py-2 px-4 pr-24 hover:bg-dark700 transition-all duration-3000 flex items-center gap-2'>
                                    Live session
                                </Link>        
                                <Link to={ROUTES.home} className='text-sm font-semibold text-white font-["Times_New_Roman"] py-2 px-4 pr-24 hover:bg-dark700 transition-all duration-3000 flex items-center gap-2'>
                                    Challengess
                                </Link>               
                            </div>
                        </div>
                        <div className="relative hidden ml-4 menu md:block">
                            <button 
                                type="button"
                                onClick={toggleProfile}
                                className='relative flex items-center justify-center transition-all hover:text-electric duration-3000'
                            >
                                <img src={user?.profile_picture || userPlaceholder} alt="Profile" className='object-cover w-12 h-12 rounded-full' />
                            </button>
                            <div className={`absolute left-[-150px] flex flex-col gap-1 border-2 rounded-md z-[100] top-16 border-border02 dropdown-items bg-dark800 transition-all duration-300 ease-in-out ${isProfileOpen ? 'max-h-[200px] opacity-100 pointer-events-auto' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                                <Link to={ROUTES.home} className='text-sm font-semibold text-white font-["Times_New_Roman"] py-2 px-4 pr-24 hover:bg-dark700 transition-all duration-3000 flex items-center gap-2'>
                                    Your Profile
                                </Link>    
                                <Link to={ROUTES.home} className=' text-nowrap text-sm font-semibold text-white font-["Times_New_Roman"] py-2 px-4 pr-24 hover:bg-dark700 transition-all duration-3000 flex items-center gap-2'>
                                    Settings
                                </Link>        
                                <Link to={ROUTES.home} className='text-sm font-semibold text-white font-["Times_New_Roman"] py-2 px-4 pr-24 hover:bg-dark700 transition-all duration-3000 flex items-center gap-2'>
                                    Monetization
                                </Link>               
                                <button onClick={handleLogout} className='text-sm font-semibold text-white font-["Times_New_Roman"] py-2 px-4 pr-24 hover:bg-dark700 transition-all duration-3000 flex items-center gap-2 w-full text-left'>
                                    Sign Out
                                </button>               
                            </div>
                        </div>
                    </div>
                    <div className="relative menu md:hidden">
                        <button type="button" onClick={toggleSidebar} ref={sidebarToggleRef}>
                            <img src={sidebarOpen ? close : menu} alt="menu" className='w-8 h-8' />
                        </button>
                    </div>
                </div>
            </nav>
        </header>
        <div
            ref={sidebarRef}
            className={`md:hidden fixed top-[90px] left-[25%] w-3/4 h-full transition-all duration-500 ease-in-out bg-dark800 sidebar z-50 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
            <div className="w-full h-full sidebar-content">
                <div className="w-full top-content h-[60%] flex-col flex ">
                    <div className="w-full p-2 sidebar-header">
                        <form action="" className="relative">
                            <ion-icon name="search-outline" className='absolute text-xl -translate-y-1/2 left-3 top-1/2 text-border'></ion-icon>
                            <input type="text" placeholder='Search codespher...' className='w-full h-full p-2 pl-10 transition-all duration-300 border-2 rounded-md bg-dark800 border-border02 text-white000 focus:border-electric focus:outline-none' /> 
                        </form>
                    </div>  
                    <div className="flex flex-col gap-3 p-2 py-2 overflow-y-auto main-contents">
                        <div className="menu">
                            <Link to={ROUTES.home} className='text-xl font-semibold text-white font-["Times_New_Roman"] py-2 px-2 pr-24 rounded-md hover:bg-dark700 transition-all duration-3000 flex items-center justify-left gap-2'>
                            <img src={home} alt="" className='w-6 h-6' />
                            Home
                            </Link>
                        </div>
                        <div className="menu">
                            <Link to={ROUTES.home} className='text-xl font-semibold text-white font-["Times_New_Roman"] py-2 px-2 pr-24 rounded-md hover:bg-dark700 transition-all duration-3000 flex items-center justify-left gap-2'>
                            <img src={job} alt="" className='w-6 h-6' />
                            Jobs
                            </Link>
                        </div>
                        <div className="menu">
                            <button
                            onClick={toggleExplore}
                            className='w-full relative text-xl font-semibold text-white font-["Times_New_Roman"] py-2 px-2 pr-24 rounded-md hover:bg-dark700 transition-all duration-3000 flex items-center justify-left gap-2'>
                            <img src={explore} alt="" className='w-6 h-6' />
                            Explore
                            <span className='absolute -translate-y-1/2 right-2 top-1/2'>
                                <img src={dropdown} alt="" className={`w-6 h-6 transition-transform duration-300 ${isExploreOpen ? 'rotate-180' : ''}`} />
                            </span>
                            </button>
                            <div className={`p-1 pl-8 rounded-md dropdown bg-dark900 transition-all duration-300 ease-in-out overflow-hidden ${isExploreOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <Link to={ROUTES.home} className='text-xl font-semibold text-white font-["Times_New_Roman"] pl-4 py-2 pr-24 rounded-md hover:bg-dark700 transition-all duration-3000 flex items-center justify-left gap-2'>Articles</Link>
                                <Link to={ROUTES.home} className='text-xl font-semibold text-white font-["Times_New_Roman"] pl-4 py-2 pr-24 rounded-md hover:bg-dark700 transition-all duration-3000 flex items-center justify-left gap-2'>Tutorials</Link>
                                <Link to={ROUTES.home} className='text-xl font-semibold text-white font-["Times_New_Roman"] pl-4 py-2 pr-24 rounded-md hover:bg-dark700 transition-all duration-3000 flex items-center justify-left gap-2'>Trending</Link>
                                <Link to={ROUTES.home} className='text-xl font-semibold text-white font-["Times_New_Roman"] pl-4 py-2 pr-24 rounded-md hover:bg-dark700 transition-all duration-3000 flex items-center justify-left gap-2'>AI Recs</Link>
                            </div>
                        </div>
                        <div className="menu">
                            <button
                            onClick={toggleCommunity}
                            className='w-full relative text-xl font-semibold text-white font-["Times_New_Roman"] py-2 px-2 pr-24 rounded-md hover:bg-dark700 transition-all duration-3000 flex items-center justify-left gap-2'>
                            <img src={community} alt="" className='w-6 h-6' />
                            Community
                            <span className='absolute -translate-y-1/2 right-2 top-1/2'>
                                <img src={dropdown} alt="" className={`w-6 h-6 transition-transform duration-300 ${isCommunityOpen ? 'rotate-180' : ''}`} />
                            </span>
                            </button>
                            <div className={`p-1 pl-8 rounded-md dropdown bg-dark900 transition-all duration-300 ease-in-out overflow-hidden ${isCommunityOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <Link to={ROUTES.home} className='text-xl font-semibold text-white font-["Times_New_Roman"] pl-4 py-2 pr-24 rounded-md hover:bg-dark700 transition-all duration-3000 flex items-center justify-left gap-2'>Q&A Forum</Link>
                                <Link to={ROUTES.home} className='text-xl font-semibold text-white font-["Times_New_Roman"] pl-4 py-2 pr-24 rounded-md hover:bg-dark700 transition-all duration-3000 flex items-center justify-left gap-2'>Live Collab</Link>
                                <Link to={ROUTES.home} className='text-xl font-semibold text-white font-["Times_New_Roman"] pl-4 py-2 pr-24 rounded-md hover:bg-dark700 transition-all duration-3000 flex items-center justify-left gap-2'>Events</Link>
                                <Link to={ROUTES.home} className='text-xl font-semibold text-white font-["Times_New_Roman"] pl-4 py-2 pr-24 rounded-md hover:bg-dark700 transition-all duration-3000 flex items-center justify-left gap-2'>Mentorship</Link>
                            </div>
                        </div>
                        <div className="menu">
                            <button
                            onClick={toggleGroups}
                            className='w-full relative text-xl font-semibold text-white font-["Times_New_Roman"] py-2 px-2 pr-24 rounded-md hover:bg-dark700 transition-all duration-3000 flex items-center justify-left gap-2'>
                            <img src={group} alt="" className='w-6 h-6' />
                            Groups
                            <span className='absolute -translate-y-1/2 right-2 top-1/2'>
                                <img src={dropdown} alt="" className={`w-6 h-6 transition-transform duration-300 ${isGroupsOpen ? 'rotate-180' : ''}`} />
                            </span>
                            </button>
                            <div className={`p-1 rounded-md dropdown bg-dark900 transition-all duration-300 ease-in-out overflow-hidden ${isGroupsOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <h1 className='text-xl font-semibold text-border font-["Times_New_Roman"] pl-4 py-2 pr-24 rounded-md flex items-center justify-left gap-2'>YOUR GROUPS</h1>
                                <hr className='h-2 border-border02' />
                                {loadingGroups ? (
                                    <div className='text-xl font-semibold text-border font-["Times_New_Roman"] pl-4 py-2 pr-24 rounded-md flex items-center justify-left gap-2'>
                                        Loading...
                                    </div>
                                ) : userGroups.length > 0 ? (
                                    userGroups.map(group => (
                                        <Link 
                                            key={group.id}
                                            to={`/groups/${group.id}`} 
                                            className='text-xl text-nowrap font-semibold text-white font-["Times_New_Roman"] pl-4 py-2 pr-24 rounded-md hover:bg-dark700 transition-all duration-3000 flex items-center justify-left gap-2'
                                        >
                                            <img src={group.group_icon || defaultGroupIcon} alt={group.name} className='w-6 h-6 rounded-md object-cover' />
                                            <span className='capitalize'>{group.name}</span>
                                        </Link>
                                    ))
                                ) : (
                                    <div className='text-xl font-semibold text-border font-["Times_New_Roman"] pl-4 py-2 pr-24 rounded-md flex items-center justify-left gap-2'>
                                        No groups joined
                                    </div>
                                )}
                                <hr className='h-2 mt-2 border-border02' />
                                <h1 className='text-xl font-semibold text-border font-["Times_New_Roman"] pl-4 py-1 pr-24 rounded-md flex items-center justify-left gap-2'>DISCOVER</h1>
                                <hr className='h-2 border-border02' />
                                <Link to={ROUTES.groups} className='text-xl text-nowrap font-semibold text-white font-["Times_New_Roman"] pl-4 py-2 pr-24 rounded-md hover:bg-dark700 transition-all duration-3000 flex items-center justify-left gap-2'>
                                    <img src={logo} alt="" className='w-6 h-6' />
                                    Browse All Groups
                                </Link>
                                <Link to={ROUTES.groupCreate} className='text-xl text-nowrap font-semibold text-white font-["Times_New_Roman"] pl-4 py-2 pr-24 rounded-md hover:bg-dark700 transition-all duration-3000 flex items-center justify-left gap-2'>
                                    <img src={add} alt="" className='w-6 h-6' />
                                    Create New Group
                                </Link>
                            </div>
                        </div>
                        <div className="menu">
                            <button
                            onClick={toggleAddnew}
                            className='w-full relative text-xl font-semibold text-white font-["Times_New_Roman"] py-2 px-2 pr-24 rounded-md hover:bg-dark700 transition-all duration-3000 flex items-center justify-left gap-2'>
                            <img src={add} alt="" className='w-6 h-6' />
                            Create
                            <span className='absolute -translate-y-1/2 right-2 top-1/2'>
                                <img src={dropdown} alt="" className={`w-6 h-6 transition-transform duration-300 ${isAddnewOpen ? 'rotate-180' : ''}`} />
                            </span>
                            </button>
                            <div className={`p-1 pl-8 rounded-md dropdown bg-dark900 transition-all duration-300 ease-in-out overflow-hidden ${isAddnewOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <Link to={ROUTES.home} className='text-xl font-semibold text-white font-["Times_New_Roman"] pl-4 py-2 pr-24 rounded-md hover:bg-dark700 transition-all duration-3000 flex items-center justify-left gap-2'>New Feed</Link>
                                <Link to={ROUTES.home} className='text-xl font-semibold text-white font-["Times_New_Roman"] pl-4 py-2 pr-24 rounded-md hover:bg-dark700 transition-all duration-3000 flex items-center justify-left gap-2'>Live Session</Link>
                                <Link to={ROUTES.home} className='text-xl font-semibold text-white font-["Times_New_Roman"] pl-4 py-2 pr-24 rounded-md hover:bg-dark700 transition-all duration-3000 flex items-center justify-left gap-2'>Challenge</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className='mt-3 border-border02' />
                <div className="p-2 sidebar-btm">
                        <div className="flex items-center gap-2 top justify-left">
                            <img src={user?.profile_picture || userPlaceholder} alt="" className='w-12 h-12 rounded-full' />
                            <div className="flex flex-col">
                                <h1 className="text-2xl font-semibold text-white text-nowrap">{user?.full_name || 'Guest User'}</h1>
                                <p className="text-sm text-border">@{user?.username || 'guest'}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center mt-3 container-box ">
                            <div className="w-full menu">
                                <Link to={ROUTES.home} className='w-full text-xl font-semibold text-white font-["Times_New_Roman"] py-2 px-2 rounded-md hover:bg-dark700 transition-all duration-3000 flex items-center justify-left gap-2'>
                                <img src={user?.profile_picture || userPlaceholder} alt="" className='w-6 h-6 rounded-full' />
                                Your Profile
                                </Link>
                            </div>
                            <div className="w-full menu">
                                <Link to={ROUTES.home} className='w-full text-xl font-semibold text-white font-["Times_New_Roman"] py-2 px-2 rounded-md hover:bg-dark700 transition-all duration-3000 flex items-center justify-left gap-2'>
                                <img src={money} alt="" className='w-6 h-6' />
                                Monetization
                                </Link>
                            </div>
                            <div className="w-full menu">
                                <Link to={ROUTES.home} className='w-full text-xl font-semibold text-white font-["Times_New_Roman"] py-2 px-2 rounded-md hover:bg-dark700 transition-all duration-3000 flex items-center justify-left gap-2'>
                                <img src={settings} alt="" className='w-6 h-6' />
                                Settings
                                </Link>
                            </div>
                            <div className="w-full menu">
                                <button onClick={handleLogout} className='w-full text-xl font-semibold text-white font-["Times_New_Roman"] py-2 px-2 rounded-md hover:bg-dark700 transition-all duration-3000 flex items-center justify-left gap-2 text-left'>
                                    <img src={signout} alt="" className='w-6 h-6' />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                </div>
            </div>
        </div>
        </>
        
    )
}

export default Navbar;