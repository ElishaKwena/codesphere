import React from 'react';
import { useState, useEffect, useRef} from 'react';
import {Link} from 'react-router-dom'
// components
import Comment from './Comment'



// images and icons
import arrow from '../assets/icons/dropdown.png'

import react from '../assets/icons/react.png'
import javascript from '../assets/icons/java-script.png'
import css from '../assets/icons/css.png'
import java from '../assets/icons/java.png'
import python from '../assets/icons/python.png'
import upvote from '../assets/icons/like.png'
import link from '../assets/icons/linkicon.png'
import comment from '../assets/icons/comments.png'
import bookmark from '../assets/icons/save.png'
import image from '../assets/icons/image.png'
import at from '../assets/icons/at.png'
import profile from '../assets/images/user2.png'
import profile1 from '../assets/images/user4.png'
import profile2 from '../assets/images/user5.png'
import profile3 from '../assets/images/user6.png'
import option from '../assets/icons/option.png'

import close from '../assets/icons/close.png'
import posts from '../assets/icons/posts.png'
import whatsapp from '../assets/icons/whatsapp.png'
import twitter from '../assets/icons/twitter.png'
import reddit from '../assets/icons/reddit.png'
import facebook from '../assets/icons/facebook.png'
import instagram from '../assets/icons/instagram.png'
import share from '../assets/icons/share.png'
import hide from '../assets/icons/hide.png'
import block from '../assets/icons/block.png'
import mute from '../assets/icons/mute.png'
import report from '../assets/icons/report.png'
import follow from '../assets/icons/follow.png'
import dislike from '../assets/icons/dislike.png'


const options = [
    {
        icon: dislike,
        text: 'not interested in this post',
    },
    {
        icon: share,
        text: 'share',
    },
    {
        icon: link,
        text: 'copy post URL',
    },
    {
        icon: bookmark,
        text: 'bookmark',
    },
    {
        icon:hide,
        text: 'hide this post',
    },
    {
        icon: follow,
        text: 'follow reactDevOps',
    },
    {
        icon: block,
        text: 'block reactDevOps',
    },
    {
        icon: block,
        text: 'block Sarah Developer',
    },
    {
        icon: mute,
        text: 'mute Sarah Developer',
    },
    {
        icon: report,
        text: 'Report post',
    }
]
const taggedGroups=[
    {   
        id:1,
        icon: react,
        name: 'React DevOps'
    },
    {
        id:2,
        icon: javascript,
        name: 'JavaScript Wizards'
    },
    {
        id:3,
        icon:python,
        name:'Pythoniasts'
    },
    {
        id:4,
        icon:java,
        name:'java juggernauts'
    },
    {
        id:5,
        icon:css,
        name:'css wizards'
    }
]
const PostModal = ({post, postIndex, posts, onClose}) => {
    const [currentPost, setCurrentPost] = useState(post)
    const [currentIndex, setCurrentIndex] = useState(postIndex)
    // handling navigation between posts
    const handleNextPost = () =>{
        if (currentIndex < posts.length -1){
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            setCurrentPost(posts[newIndex])
        }
    }

    const handlePrevPost = () =>{
        if (currentIndex > 0){
            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            setCurrentPost(posts[newIndex])
        }
    }
    if (!currentPost) return null;
    
    
    
    
    const [postOptions,setPostOptions] = useState(false);
    
    const [rightsidebar, setRightsidebar] = useState(false);

    const toggleRightSidebar = () => {
        setRightsidebar(!rightsidebar)
    }
   
    const togglePostOptions = () => {
        setPostOptions(!postOptions)
    }

    useEffect(() =>{
        const handleEscKey = (event) =>{
            if (event.key === 'Escape'){
                onClose()
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    },[onClose]);

    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };
    
    return (
        <>
        <div className='h-screen fixed inset-0 z-30 flex items-start justify-center bg-black md:bg-black/80 pt-[90px] md:pt-[95px] bg-opacity-70 overflow-y-auto md:pb-3'
        onClick={handleBackdropClick} 
        >
            <div 
            className='w-full md:w-[70%]  rounded-lg bg-black z-50 md:border border-border02 relative flex items-start justify-between gap-1'
            onClick={(event) => event.stopPropagation()}
            >
                {/* contents left */}
                <div className="flex-col gap-2 p-2 border-r md:p-4 w-3/3 md:w-2/3 border-border02 contents-left">
                {/* left top */}
                    <div className="flex items-center justify-between w-full gap-2 mb-2 contents-left-top">
                        <div className="flex items-center gap-2 view-btns justify-left">
                            <button 
                            type="button"
                            onClick={handlePrevPost}
                            disabled={currentIndex === 0}
                            className='p-1 transition-all duration-300 border rounded-md filterrelative peer hover:bg-dark700 border-border02'>
                                <img src={arrow} alt="arrow" className="w-6 h-auto rotate-90"/>
                            </button>
                            <button 
                            type="button"
                            onClick={handleNextPost}
                            disabled={currentIndex === posts.length -1}
                            className='p-1 transition-all duration-300 border rounded-md filterrelative peer hover:bg-dark700 border-border02'>
                                <img src={arrow} alt="arrow" className="w-6 h-auto rotate-[-90deg]"/>
                            </button>
                        </div>
                        <div className="flex items-center justify-between gap-2 md:hidden">
                            <button type="button" 
                            onClick={onClose}
                            className="p-1 border rounded-md filterrelative peer hover:bg-dark700 border-border02">
                                <img src={close} alt="" className="w-6 h-auto"/>
                            </button>
                            <button 
                            onClick={toggleRightSidebar}
                            type="button" className="p-1 border rounded-md md:hidden filterrelative peer hover:bg-dark700 border-border02">
                                <img src={option} alt="" className="w-6 h-auto"/>
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 post-details">
                        <div className="w-full post-contents">
                        <div className="post-contents-top">
                            <div className="title">
                                <h1 className='text-2xl font-bold text-white capitalize'>{currentPost.title}</h1>
                            </div>
                            <div className="created_at">
                                <p className='font-bold text-md text-border02 '>{currentPost.createdAt}</p>
                            </div>
                        </div>
                        <div className="w-full post-contents-banner">
                            <img src={currentPost.postBanner} alt="" className='w-full h-auto rounded-lg'/>
                        </div>
                        <div className="flex flex-wrap items-center w-full gap-1 mt-2 justift-left y-left tagged-groups">
                            {taggedGroups.map(group => (
                                <Link to="/" 
                                
                                key={group.id} className='flex items-center gap-1 p-1 border rounded-[3px] justify-left bg-dark800 border-border02'>
                                    <img src={group.icon} alt="react" className='w-6 h-auto'/>
                                    <p className='text-[13px] text-border'>{group.name}</p>
                                </Link>
                            ))}
                        </div>
                        <div className="w-full mt-3 content">
                            <p className="text-white md:text-sm contents">{currentPost.content}</p>
                        </div>
                        </div>
                        <div className="flex items-center justify-between w-full p-2 mt-5 border rounded border-border02 post-actions">
                            <div className="flex items-center gap-1 p-[2px] border rounded-md votes-div border-border02">
                                <button className='p-2 border rounded-md border-border02'>
                                    <img src={upvote} alt="upvote" className='w-5 h-auto'/>
                                </button>
                                <p className='text-sm text-border'>{currentPost.votes}</p>
                                <button className='p-2 border rounded-md border-border02'>
                                    <img src={upvote} alt="upvote" className='w-5 h-auto'/>
                                </button>
                            </div>
                            <span className="flex items-center gap-1 p-2 border rounded-md comments votes-div border-border02">
                                <img src={comment} alt="comment" className='w-6 h-auto'/>
                                <p className='text-sm text-border'>{currentPost.comments}</p>
                            </span>
                            <button className="flex items-center gap-1 p-2 transition-all duration-300 border rounded-md comments hover:bg-dark700 votes-div border-border02">
                                <img src={bookmark} alt="comment" className='w-6 h-auto'/>
                                <p className='text-sm text-border'>Bookmark</p>
                            </button>
                            <button className="flex items-center gap-1 p-2 transition-all duration-300 border rounded-md comments votes-div hover:bg-dark700 border-border02">
                                <img src={link} alt="comment" className='w-6 h-auto'/>
                                <p className='text-sm text-border'>Copy</p>
                            </button>
                        </div>
                        <div className="hidden w-full p-0 mt-3 commentform">
                            <form action="" className='flex flex-col items-center justify-between w-full h-auto border rounded-md border-border02 bg-dark800 gap1'>
                                <textarea name="" id="" placeholder='What are your thoughts on this?' className='w-full p-2 bg-transparent border border-none rounded-md h-[150px] text-white001 text-sm resize-none  focus:outline-none'></textarea>
                                <div className="flex items-center justify-between w-full px-1 py-1 pl-0 border-t rounded-b border-border02 input-box gap2 bg-dark700">
                                    <div className="flex items-center gap-0 justify-left ">
                                        <div className="rounded-md px-0 tep-[2px] flex">
                                            <input id="file" type="file" className='hidden'/>
                                            <label htmlFor="file" className='p-2 py-0 rounded-md cursor-pointer'>
                                                <img src={image} alt="" className='h-auto w-7'/>
                                            </label>
                                        </div>
                                        <button type="button" className="rounded-md p-[5px]">
                                            <img src={at} alt="" className='w-5 h-auto'/>
                                        </button>
                                    </div>
                                    
                                    <button type="submit" className='px-4 py-2 text-white border rounded-md bg-dark900 border-border02'>Post</button>
                                </div>
                                
                            </form>
                        </div>
                        {/* comments div */}
                        <Comment/>
                    </div>
                </div>
                {/* contents right */}
                <div className={`fixed flex flex-col w-full h-screen gap-2 p-4 px-3 bg-dark900
                md:static md:w-1/3 md:ml-auto md:z-50 // Desktop styles
                ${rightsidebar ? 'right-0' : '-right-full'} // Mobile toggle
                transition-all duration-500 ease-in-out z-20`}>
                    <div className="flex items-center justify-between w-full md:justify-end right-top">
                        <button
                        type="button"
                        onClick={toggleRightSidebar}
                        className="flex md:hidden items-center justify-center border border-border02 p-[1px] rounded-sm">
                            <img src={arrow} alt="" className="w-6 h-6 rotate-90"/>
                        </button>
                        <div className="relative flex items-center justify-between gap-4 right-btns">
                            <button 
                            className="p-1 border rounded-md border-border02"
                            onClick={togglePostOptions}
                            >
                                <img src={option} alt="" className="w-5 h-5 "/>
                            </button>
                            <button 
                            className="z-30 p-1 border rounded-md border-border02"
                            type="button"
                            onClick={() => {
                                console.log('Close button clicked');
                                onClose();}}
                            // onClick={(e) =>{
                            //     e.stopPropagation();
                            //     onClose();
                            // }}
                            >
                                <img src={close} alt="" className="w-5 h-5"/>
                            </button>
                            <div className={`absolute border border-border02 right-[40px] top-[30px] flex flex-col items-center gap-2 options-div w-[294px] bg-dark800 rounded-md p-1 transition-all duration-300 ease-in-out ${postOptions ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                {options.map((option, index) => (
                                    <button key={index} className="flex items-center justify-start w-full gap-2 px-2 py-1 transition-all duration-300 rounded-sm hover:bg-dark700">
                                        <img src={option.icon} alt="" className="w-5 h-auto"/>
                                        <p className="text-sm text-white capitalize">{option.text}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 p-1 border rounded-md poster border-border02">
                        <div className="flex items-center justify-between gap-2">
                            <img src={currentPost.author.image} alt="" className="object-cover object-top w-12 h-12 rounded-full"/>
                            <div>
                                <h1 className="capitalize text-[12px] text-white000">{currentPost.author.authorname}</h1>
                                <p className="text-[10px] text-border">{currentPost.author.handle}</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 text-white transition-all duration-300 border-2 border-white rounded-md hover:bg-electric/40 bg-electric">Follow</button>
                    </div>
                    {/* tagged users */}
                    <div className="flex flex-wrap items-center justify-center gap-2 p-1 border rounded-md tagged-users border-border02">
                        <Link to="" className='p-2 text-sm transition-all duration-300 rounded-sm hver text-white000 bg-dark800 hover:text-electric hover:bg-dark700'>Alex Coder</Link>
                        <Link to="" className='p-2 text-sm transition-all duration-300 rounded-sm hver text-white000 bg-dark800 hover:text-electric hover:bg-dark700'>Harryoter coder</Link>
                        <Link to="" className='p-2 text-sm transition-all duration-300 rounded-sm hver text-white000 bg-dark800 hover:text-electric hover:bg-dark700'>David Kim</Link>
                        <Link to="" className='p-2 text-sm transition-all duration-300 rounded-sm hver text-white000 bg-dark800 hover:text-electric hover:bg-dark700'>John Doe</Link>
                        <Link to="" className='p-2 text-sm transition-all duration-300 rounded-sm hver text-white000 bg-dark800 hover:text-electric hover:bg-dark700 '>Patricia Kay</Link>
                    </div>
                    {/* posts group origin */}
                    <div className="w-full post-group">
                        <div className="flex flex-col gap-2 border rounded-md group-card border-border02">
                            <div className="flex items-center justify-between gap-2 p-2 top">
                                <div className="flex items-center justify-between gap-1 group-icon">
                                    <img src={react} alt="" className="w-12 h-12 rounded-sm" />
                                    <div>
                                        <h1 className="text-lg text-white">React DevOps</h1>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center gap-0 p-2 py-1 border rounded-md mem-count bg-dark800 border-border02">
                                   <h2 className="text-border mb-[-5px]">24k</h2> 
                                   <p className="font-bold">Members</p>
                                </div>
                            </div>
                            <div className="flex-grow px-2 about">
                                <p className="text-sm text-border">Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident obcaecati soluta reiciendis incidunt ab. Modi vitae, quasi ducimus, rem exercitationem quos facere consequuntur quas autem fuga repellendus nulla ipsam. Possimus!</p>
                            </div>
                            <div className="flex items-center justify-between px-2 view">
                                <div className="members-box relative w-[120px] h-[40px]">
                                    <div className="absolute left-0 top-0 w-[40px] h-[40px] rounded-full border-2 border-dark900 overflow-hidden">
                                        <img src={profile1} alt="user" className="object-cover w-full h-full" />
                                    </div>
                                    <div className="absolute left-[25px] top-0 w-[40px] h-[40px] rounded-full border-2 border-dark900 overflow-hidden">
                                        <img src={profile2} alt="user" className="object-cover w-full h-full" />
                                    </div>
                                    <div className="absolute left-[50px] top-0 w-[40px] h-[40px] rounded-full border-2 border-dark900 overflow-hidden">
                                        <img src={profile3} alt="user" className="object-cover w-full h-full" />
                                    </div>
                                    <div className="absolute left-[75px] top-0 w-[40px] h-[40px] rounded-full border-2 border-dark900 overflow-hidden">
                                        <img src={profile} alt="user" className="object-cover w-full h-full" />
                                    </div>
                                </div>
                                <div>
                                    <Link to="" className="left-[100%] text-lg text-electric">View</Link>
                                </div>
                            </div>
                            <div className="flex items-center justify-between w-full p-2 border-t rounded-b-md actions border-border02 bg-dark800">
                                <div className="flex items-center justify-between gap-2">
                                    <img src={posts} alt="" className='w-5 h-auto'/>
                                    <p className="text-sm text-border">posts</p>
                                </div>
                                <div className="group-type">
                                    <p className="text-border">public group</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* share options */}
                    <div className="flex flex-col w-full gap-1 p-2 border rounded-md share border-border02">
                        <h1 className="text-white">Share post to :</h1>
                        <div className="sharebox">
                            <a href="">
                                <img src={facebook} alt=""/>
                                <span className="name"></span>
                                <div className="linkname">
                                    <span>Facebook</span>
                                </div>
                            </a>
                            <a href="">
                                <img src={instagram} alt=""/>
                                <span className="name instaname"></span>
                                <div className="linkname insta">
                                    <span>Instagram</span>
                                </div>
                            </a>
                            <a href="">
                                <img src={reddit} alt=""/>
                                <span className="name redditname"></span>
                                <div className="linkname reddit">
                                    <span>Reddit</span>
                                </div>
                            </a>
                            <a href="">
                                <img src={twitter} alt=""/>
                                <span className="name twittername"></span>
                                <div className="linkname twitter">
                                    <span>twitter</span>
                                </div>
                            </a>
                            <a href="">
                                <img src={whatsapp} alt=""/>
                                <span className="name whatname"></span>
                                <div className="linkname what">
                                    <span>whatsapp</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default PostModal;