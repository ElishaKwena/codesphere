import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { ROUTES } from '../../config/constants'
import { groupsAPI } from '../../services/api'

import Group from '../../components/Group'
import Paginator from '../../components/Paginator'
import ReactPaginate from 'react-paginate';

//  images
import react from '../../assets/icons/react2.png'
import bot from '../../assets/icons/bot.png'
import devops from '../../assets/icons/devops.png'
import security from '../../assets/icons/security1.png'
import arrow from '../../assets/icons/dropdown.png'
import search from '../../assets/icons/search.png'
import python from '../../assets/icons/python.png'

const Groups = () =>{
    const location = useLocation();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSearchQuery, setActiveSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const itemsPerPage = 8;
    const [successMessage, setSuccessMessage] = useState(location.state?.message);
    const [topSearches, setTopSearches] = useState([]);
    const [loadingTopSearches, setLoadingTopSearches] = useState(true);

    // Clear message after a few seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
                // Clean up location state
                window.history.replaceState({}, document.title)
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // Fetch top searches (most popular group names/categories)
    const fetchTopSearches = async () => {
        try {
            setLoadingTopSearches(true);
            // Fetch groups to get popular names
            const response = await groupsAPI.getGroups({ page_size: 100 });
            const allGroups = response.data.results || response.data;
            
            // Get the most common group names (first 5)
            const groupNames = allGroups
                .map(group => group.name)
                .filter(name => name && name.trim().length > 0)
                .slice(0, 5);
            
            // Create top searches with default icons
            const searches = groupNames.map((name, index) => ({
                name: name,
                icon: [python, react, bot, devops, security][index % 5] // Cycle through available icons
            }));
            
            setTopSearches(searches);
        } catch (err) {
            console.error('Error fetching top searches:', err);
            // Fallback to default searches if API fails
            setTopSearches([
                { name: 'React', icon: react },
                { name: 'Python', icon: python },
                { name: 'AI/ML', icon: bot },
                { name: 'DevOps', icon: devops },
                { name: 'Security', icon: security }
            ]);
        } finally {
            setLoadingTopSearches(false);
        }
    };

    // Fetch groups from API
    const fetchGroups = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const params = {
                page: currentPage,
                page_size: itemsPerPage,
                search: activeSearchQuery,
                category: selectedCategory,
            };
            
            console.log('Fetching groups with params:', params);
            const response = await groupsAPI.getGroups(params);
            console.log('Groups response:', response.data);
            setGroups(response.data.results || response.data);
            setTotalCount(response.data.count || response.data.length);
            setTotalPages(Math.ceil((response.data.count || response.data.length) / itemsPerPage));
        } catch (err) {
            console.error('Error fetching groups:', err);
            setError('Failed to load groups. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories
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

    useEffect(() => {
        fetchCategories();
        fetchTopSearches();
    }, []);

    useEffect(() => {
        fetchGroups();
    }, [currentPage, activeSearchQuery, selectedCategory]);

    // Debug useEffect to log parameter changes
    useEffect(() => {
        console.log('Search parameters changed:', {
            currentPage,
            activeSearchQuery,
            selectedCategory
        });
    }, [currentPage, activeSearchQuery, selectedCategory]);

    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Search submitted:', searchQuery);
        setActiveSearchQuery(searchQuery);
        setCurrentPage(1);
    };

    // Handle category filter
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setCurrentPage(1);
    };

    // Handle page change
    const handlePageClick = (event) => {
        setCurrentPage(event.selected + 1);
    };

    // Handle top search clicks
    const handleTopSearchClick = (searchTerm) => {
        console.log('Top search clicked:', searchTerm);
        setSearchQuery(searchTerm);
        setActiveSearchQuery(searchTerm);
        setCurrentPage(1);
    };

    if (loading && groups.length === 0) {
        return (
            <main className='flex flex-col items-center justify-center w-full min-h-screen pt-[90px] bg-dark900'>
                <div className="text-white text-xl">Loading groups...</div>
            </main>
        );
    }

    return(
        <>
         <main className='flex flex-col items-start gap-3  w-full min-h-screen pt-[90px] bg-dark900'>
            <section className="flex flex-col items-start justify-center w-full gap-2 groups-section">
               <div className="w-[97%] mx-auto gap-2 flex flex-col items-start justify-start">
                {successMessage && (
                    <div className="w-full p-4 text-center text-green-400 bg-green-900/20 border border-green-500 rounded-md">
                        {successMessage}
                    </div>
                )}
                <div className="flex items-center justify-between w-full header">
                    <div className="flex flex-col items-start justify-start gap-0 left">
                        <h1 className=" font-bold text-white md:text-2xl text-lg font-['Inter']">Explore Groups</h1>
                        <p className="text-sm text- text-border">Connect with communities in your tech stack</p>
                    </div>
                    <Link
                    to="/groups/create"
                    className="flex items-center justify-center p-2 transition-all duration-300 border rounded-sm bg-electric border-electric group">
                        <p className="text-sm text-white text-nowrap">Create Group</p>
                    </Link>
                </div>
                <div className="flex flex-col-reverse items-start justify-between w-full gap-2 p-3 border rounded-md md:p-4 md:flex-row nav border-border02 bg-dark800">
                    <div className="left w-full md:w-[70%] flex flex-col items-start justify-left gap-6">
                        <form onSubmit={handleSearch} className="relative flex items-center justify-center w-full">
                            <span className='absolute left-2'>
                                <img src={search} alt="" className="w-6 h-6"/>
                            </span>
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full p-2 pl-10 pr-20 transition-all duration-300 border rounded-md border-border02 bg-dark800 focus:outline-none focus:border-electric" 
                                placeholder="Search groups"/>
                            <button 
                                type="submit"
                                className="absolute right-2 px-3 py-1 text-sm text-white bg-electric rounded-md hover:bg-electric/80 transition-all duration-300"
                            >
                                Search
                            </button>
                        </form>
                        <div className="flex flex-wrap items-center justify-start gap-2 top-searches">
                            <button 
                                onClick={() => handleTopSearchClick('')}
                                className="flex items-start gap-1 p-2 py-1 transition-all duration-300 border rounded-full group justify-left border-borde02 hover:border-electric">
                                <p className="text-sm text-white transition-all duration-300 group-hover:text-electric">All Groups</p>
                            </button>
                            {loadingTopSearches ? (
                                // Loading skeleton for top searches
                                Array.from({ length: 5 }).map((_, idx) => (
                                    <div key={idx} className="flex items-start gap-1 p-2 py-1 border rounded-full border-borde02 animate-pulse">
                                        <div className="w-5 h-5 bg-dark700 rounded"></div>
                                        <div className="w-16 h-4 bg-dark700 rounded"></div>
                                    </div>
                                ))
                            ) : (
                                topSearches.map((search, idx) => (
                                    <button 
                                    key={idx}
                                    onClick={() => handleTopSearchClick(search.name)}
                                    className="flex items-start gap-1 p-2 py-1 transition-all duration-300 border rounded-full group justify-left border-borde02 hover:border-electric">
                                        <img src={search.icon} alt=""className='w-5 h-auto'/>
                                        <p className="text-sm text-white transition-all duration-300 group-hover:text-electric capitalize">{search.name}</p>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="right md:w-[25%] w-full">
                        <select 
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            className="w-full p-3 text-white transition-all duration-300 border rounded-md border-border02 bg-dark800 focus:outline-none focus:border-electric">
                            <option value="" className="text-white text-md">All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id} className="text-white text-md">
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="w-full p-4 text-center text-red-400 bg-red-900/20 border border-red-500 rounded-md">
                        {error}
                    </div>
                )}

                <div className="grid flex-grow w-full grid-cols-1 gap-4 pb-3 mt-3 posts-container sm:grid-cols-2 lg:grid-cols-4">
                    {groups.map((group) =>(
                        <Group key={group.id} group={group}/>
                    ))}
                </div>

                {groups.length === 0 && !loading && (
                    <div className="w-full p-8 text-center text-white">
                        <p className="text-lg">No groups found</p>
                        <p className="text-sm text-border mt-2">Try adjusting your search or filters</p>
                    </div>
                )}
                
                {totalPages > 1 && (
                    <div className="flex items-center justify-center w-full p-2 paginator">
                      <ReactPaginate
                        previousLabel={
                           <img src={arrow} alt="previous" className="w-6 h-auto rotate-90" />
                         }
                         nextLabel={
                           <img src={arrow} alt="next" className="w-6 h-auto rotate-[-90deg] " />
                         }
                         breakLabel={
                           <span className="flex items-center justify-center font-bold text-white group-hover:text-electric">...</span>
                         }
                         pageCount={totalPages}
                         marginPagesDisplayed={1}
                         pageRangeDisplayed={5}
                         onPageChange={handlePageClick}
                         forcePage={currentPage - 1}
                         containerClassName={"flex items-center justify-between gap-2    pagesdiv"}
                         pageClassName={
                           "flex items-center justify-center p-1 border rounded-md   border-border02 w-[35px] hover:bg-dark800 transition-all               duration-300 group"
                         }
                         pageLinkClassName={"font-bold text-white    group-hover:text-electric"}
                         activeClassName={"bg-electric border-electric"}
                         activeLinkClassName={"text-dark900"}
                         previousClassName={
                           "flex items-center justify-center p-1 transition-all  duration-300 border rounded-md border-border02 hover:bg-dark800"
                         }
                         nextClassName={
                           "flex items-center justify-center p-1 transition-all  duration-300 border rounded-md border-border02 hover:bg-dark800"
                         }
                        disabledClassName={"opacity-50 cursor-not-allowed"}
                        breakClassName={
                            "flex items-center justify-center p-1 border rounded-md   border-border02 w-[35px] hover:bg-dark800 transition-all  duration-300 group"
                         }
                      />
                    </div>
                )}
               </div>
            </section>
         </main>
        </>
    );
}
export default Groups;