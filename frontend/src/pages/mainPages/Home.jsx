import React from 'react';
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { ROUTES } from '../../config/constants'
// data

import { posts } from '../../data/posts'


import FeaturedGroups from '../Groups/FeaturedGroups'
import Posts from '../../components/Posts'
import PostModal from '../../components/PostModal'
import Paginator from '../../components/Paginator';


import logo from '../../assets/icons/logo.png'
import javascript from '../../assets/icons/java-script.png'
import python from '../../assets/icons/python.png'
import ai from '../../assets/icons/artificial.png'
import add from '../../assets/icons/interface.png'
import profile from '../../assets/images/user1.jpeg'
import filter from '../../assets/icons/filter.png'
import sort from '../../assets/icons/sort.png'

const Home = () => {
    const [selectedPost, setSelectedPost] = useState(null)
    const [selectedPostIndex, setSelectedPostIndex] = useState(null)
    const [isModalOpen, setIsModalOpen]  = useState(false)

    const handlePostClick = (post, index) =>{
        setSelectedPost(post)
        setSelectedPostIndex(index)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setSelectedPost(null)
        setIsModalOpen(false)
    }

    

    
    return (
       <>
       <main className='flex flex-col items-start gap-3  w-full min-h-screen pt-[90px] bg-dark900'>
            <FeaturedGroups />
            <section className="w-full post-container">
                <div className="section-content w-[97%] mx-auto">
                    <div className="flex items-center justify-between mt-3 container-header">
                        <h1 className='text-2xl font-bold text-white md:text-2xl'>Recent Posts</h1>
                        <div className="flex items-center justify-between gap-2 pr-1 buttons">
                            <button className='p-1 transition-all duration-300 rounded-md filterrelative peer hover:bg-dark700 filter-btn'>
                                <img src={filter} alt="filter" className='w-6 h-auto'/>
                            </button>
                            <button className='p-1 transition-all duration-300 rounded-md filterrelative peer hover:bg-dark700 sort-btn'>
                                <img src={sort} alt="sort" className='h-auto w-7'/>
                            </button>
                        </div>
                    </div> 
                    <Posts 
                        onPostClick={(post, index) =>handlePostClick (post, index)}
                    />
                    <Paginator />
                </div>
            </section>
       </main>
       {isModalOpen && (
                <PostModal 
                    post={selectedPost} 
                    postIndex={selectedPostIndex}
                    posts={posts}
                    onClose={handleCloseModal} />
            )}
       </>
    )
}

export default Home;