import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { ROUTES } from '../../config/constants'

import Group from '../../components/Group'
import {groups} from '../../data/groupsData'
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



const topsearches=[
    {
        name:'React',
        icon: react,
    },
    {
        name:'Python',
        icon: python,
    },
    {
        name:'AI/ML',
        icon: bot,
    },
    {
        name:'DevOps',
        icon: devops,
    },
    {
        name:'Security',
        icon: security,
    }
]
const Groups = () =>{
    
    // pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage  = 8;

    useEffect(() =>{
        if (!Array.isArray(groups)){
            console.error('Groups data is not an array : ',groups);
        }
    },[])

    // Calculate pageCount with proper validation
    const pageCount = Array.isArray(groups) 
        ? Math.ceil(groups.length / itemsPerPage)
        : 0;
      // Get current items with validation
    const currentGroups = Array.isArray(groups)
    ? groups.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      )
    : [];
    
    // handling page change
    const handlePageClick = (event) =>{
        setCurrentPage(event.selected);
    }

    console.log('Current groups to render:', currentGroups);
    return(
        <>
         <main className='flex flex-col items-start gap-3  w-full min-h-screen pt-[90px] bg-dark900'>
            <section className="flex flex-col items-start justify-center w-full gap-2 groups-section">
               <div className="w-[97%] mx-auto gap-2 flex flex-col items-start justify-start">
               <div className="flex items-center justify-between w-full header">
                    <div className="flex flex-col items-start justify-start gap-0 left">
                        <h1 className=" font-bold text-white md:text-2xl text-lg font-['Inter']">Explore Groups</h1>
                        <p className="text-sm text- text-border">Connect with communities in your tech stack</p>
                    </div>
                    <button
                    type="button"
                    className="flex items-center justify-center p-2 transition-all duration-300 border rounded-sm bg-electric border-electric group">
                        <p className="text-sm text-white text-nowrap">Create Group</p>
                    </button>
                </div>
                <div className="flex flex-col-reverse items-start justify-between w-full gap-2 p-3 border rounded-md md:p-4 md:flex-row nav border-border02 bg-dark800">
                    <div className="left w-full md:w-[70%] flex flex-col items-start justify-left gap-6">
                        <form className="relative flex items-center justify-center w-full">
                            <span className='absolute left-2'>
                                <img src={search} alt="" className="w-6 h-6"/>
                            </span>
                            <input type="text" className="w-full p-2 pl-10 transition-all duration-300 border rounded-md border-border02 bg-dark800 focus:outline-none focus:border-electric" placeholder="Search groups"/>
                        </form>
                        <div className="flex flex-wrap items-center justify-start gap-2 top-searches">
                            <button className="flex items-start gap-1 p-2 py-1 transition-all duration-300 border rounded-full group justify-left border-borde02 hover:border-electric">
                                <p className="text-sm text-white transition-all duration-300 group-hover:text-electric">All Groups</p>
                            </button>
                            {topsearches.map((search, idx) => (
                                <button 
                                key={idx}
                                className="flex items-start gap-1 p-2 py-1 transition-all duration-300 border rounded-full group justify-left border-borde02 hover:border-electric">
                                    <img src={search.icon} alt=""className='w-5 h-auto'/>
                                    <p className="text-sm text-white transition-all duration-300 group-hover:text-electric">{search.name}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="right md:w-[25%] w-full">
                        <select name="" className="w-full p-3 text-white transition-all duration-300 border rounded-md border-border02 bg-dark800 focus:outline-none focus:border-electric" id="">
                            <option value="" className="text-white text-md">All Categories</option>
                            <option value="" className="text-white text-md">Programming Languages</option>
                            <option value="" className="text-white text-md">DevOps</option>
                            <option value="" className="text-white text-md">Frameworks</option>
                            <option value="" className="text-white text-md">AI/ML</option>
                            <option value="" className="text-white text-md">Security</option>
                            <option value="" className="text-white text-md">Career</option>
                        </select>
                    </div>
                </div>
                <div className="grid flex-grow w-full grid-cols-1 gap-4 pb-3 mt-3 posts-container sm:grid-cols-2 lg:grid-cols-4">
                    {currentGroups.map((group) =>(
                        <Group key={group.id} group={group}/>
                    ))}
                    
                    {/* <Group/> */}
                </div>
                {/* <Paginator/> */}
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
                     pageCount={pageCount}
                     marginPagesDisplayed={1}
                     pageRangeDisplayed={5}
                     onPageChange={handlePageClick}
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
               </div>
            </section>
         </main>
        </>
    );
}
export default Groups;