import React from 'react';
import {Link} from 'react-router-dom'
import { useState } from 'react';

// components

import ReplyActions from './ReplyActions';
// images
import banner1 from '../assets/icons/post1.jpg'
import profile from '../assets/images/user2.png'
import profile1 from '../assets/images/user4.png'
import profile2 from '../assets/images/user5.png'
import profile3 from '../assets/images/user6.png'
import image from '../assets/icons/image.png'
import at from '../assets/icons/at.png'
import option from '../assets/icons/option.png'
import award from '../assets/icons/award.png'
import upvote from '../assets/icons/like.png'
import comment from '../assets/icons/comments.png'
import share from '../assets/icons/share.png'
import hide from '../assets/icons/hide.png'
import block from '../assets/icons/block.png'
import mute from '../assets/icons/mute.png'
import report from '../assets/icons/report.png'
import follow from '../assets/icons/follow.png'
import dislike from '../assets/icons/dislike.png'



const replyOptions = [
    {
        id:1,
        icon:follow,
        text:'Follow Alex Coder'
    },
    {
        id:2,
        icon:mute,
        text:'Mute Alex Coder'
    },
    {
        id:3,
        icon:block,
        text:'Block Alex Coder'
    },
    {
        id:4,
        icon:report,
        text:'Report post'
    }
    
]

const Reply = () =>{
    const [isOptions, setOptions] = useState(false);
    
    const toggleReplyOptions = () => {
        setOptions(!isOptions)
    }
    return(
        <>
            <div className="flex flex-col w-full gap-2 replies">
                <div className="flex flex-col items-center w-full gap-2 p-2 border rounded-md comment-reply border-border02">
                    <div className="flex items-center justify-between w-full comment-top">
                        <div className="relative">
                            <button
                            onClick={toggleReplyOptions}
                            >
                                <img src={option} alt=""  className="w-6 h-6"/>
                            </button>
                            <div className={`opacity-0 max-w-[250px] w-[200px] left-2 absolute flex flex-col items-center justify-start gap-2 p-1 border rounded-md border-border02 duration-300 transition-all ease-in-out bg-dark800 ${isOptions ? 'max-h-[200px] opacity-100' : 'h-0 opacity 0'}`}>
                                {replyOptions.map(option => (
                                    <button 
                                    key={option.id}
                                    className="flex items-center justify-start w-full gap-2 px-2 py-1 transition-all duration-300 rounded-md hover:bg-dark700">
                                        <img src={option.icon} alt="" className="w-5 h-auto"/>
                                        <p className="text-sm text-white capitalize">{option.text}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex flex-col items-end gap-0 justify-left">
                        <h1 className="font-bold text-white capitalize">Sarah develope</h1>
                        <p className="text-sm text-border"><span className="ml-2 text-border02">35 minutes ago</span>. @sarahdeveloper</p>
                            </div>
                            <div className="relative">
                                <Link to="" className='flex items-center gap-2 justify-left'>
                                     <img src={profile3} alt="" className="w-10 h-10"/>
                                </Link>
                                <span className="absolute w-3 h-3 rounded-full left-[1px] top-7 top bg-success"></span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full comment-content">
                        <div className="comment-body">
                            <p className="text-sm text-white">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatum doloremque provident et sequi quod enim perferendis sint, quo itaque aspernatur ipsam magni sit distinctio, nemo dolore odio nam saepe iusto.
                            </p>
                        </div>
                    </div>
                    <ReplyActions/>
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
                </div>
                <div className="flex flex-col items-center w-full gap-2 p-2 border rounded-md comment-reply border-border02">
                    <div className="flex items-center justify-between w-full comment-top">
                        <button>
                             <img src={option} alt=""  className="w-6 h-6"/>
                        </button>
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex flex-col items-end gap-0 justify-left">
                        <h1 className="font-bold text-white capitalize">Sarah develope</h1>
                        <p className="text-sm text-border"><span className="ml-2 text-border02">35 minutes ago</span>. @sarahdeveloper</p>
                            </div>
                            <div className="relative">
                                <Link to="" className='flex items-center gap-2 justify-left'>
                                     <img src={profile3} alt="" className="w-10 h-10"/>
                                </Link>
                                <span className="absolute w-3 h-3 rounded-full left-[1px] top-7 top bg-success"></span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full comment-content">
                        <div className="w-full banner h-[150px] flex items-center justify-left">
                            <img src={banner1} alt="" className="object-contain h-full rounded" />
                        </div>
                        <div className="comment-body">
                            <p className="text-sm text-white">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatum doloremque provident et sequi quod enim perferendis sint, quo itaque aspernatur ipsam magni sit distinctio, nemo dolore odio nam saepe iusto.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-end w-full gap-2 comment-actions">
                        <div className="flex items-center gap-1 p-[2px] border rounded-md votes-div border-border02">
                            <button className='p-2 border rounded-md border-border02'>
                                <img src={upvote} alt="upvote" className='w-5 h-auto'/>
                            </button>
                            <p className='text-sm text-border'>100</p>
                            <button className='p-2 border rounded-md border-border02'>
                                <img src={upvote} alt="upvote" className='w-5 h-auto'/>
                            </button>
                        </div>
                        <button className="flex items-center gap-1 p-2 border rounded-md comments votes-div border-border02">
                            <img src={comment} alt="comment" className='w-6 h-auto'/>
                            <p className='text-sm text-border'>100</p>
                        </button>
                        <button className="flex items-center gap-1 p-2 border rounded-md comments votes-div border-border02">
                            <img src={award} alt="comment" className='w-6 h-auto'/>
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
                </div>
            </div>
        </>
    )
}
export default Reply;




