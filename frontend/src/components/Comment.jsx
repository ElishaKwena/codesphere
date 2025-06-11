import React from 'react';
import {Link} from 'react-router-dom'
import { useState } from 'react';

// components
import Reply from './Reply'
import CommentActions from './CommentActions';


// images
import profile from '../assets/images/user2.png'
import profile1 from '../assets/images/user4.png'
import profile2 from '../assets/images/user5.png'
import profile3 from '../assets/images/user6.png'
import image from '../assets/icons/image.png'
import banner1 from '../assets/icons/post1.jpg'
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



const commentOptions = [
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

const Comment = () =>{
    const [isOptions, setOptions] = useState(false);
    
    const toggleOptions = () => {
        setOptions(!isOptions)
    }
    return(
        <>
        <div className="flex flex-col gap-2 mt-3 comments-div">
            <div className="flex flex-col items-center gap-2 p-2 border rounded-md comment border-border02">
            <div className="flex items-center justify-between w-full comment-top">
                <div className="flex items-center gap-2 jusyify-between">
                    <div className="relative">
                        <Link to="" className='flex items-center gap-2 justify-left'>
                             <img src={profile} alt="" className="w-10 h-10"/>
                        </Link>
                        <span className="absolute w-3 h-3 rounded-full right-[1px] top-7 top bg-success"></span>
                    </div>
                    <div className="flex flex-col items-start gap-0 justify-left">
                        <h1 className="font-bold text-white">Alex Coder</h1>
                        <p className="text-sm text-border">@alexcoder. <span className="ml-2 text-border02">3 hours ago</span></p>
                    </div>
                </div>
                <div className="relative">
                    <button onClick={toggleOptions}>
                        <img src={option} alt=""  className="w-6 h-6"/>
                    </button>
                    <div className={`opacity-0 max-w-[250px] w-[200px] right-2 absolute flex flex-col items-center justify-start gap-2 p-1 border rounded-md border-border02 duration-300 transition-all ease-in-out bg-dark800 ${isOptions ? 'max-h-[200px] opacity-100' : 'h-0 opacity 0'}`}>
                        {commentOptions.map(option => (
                             <button 
                             key={option.id}
                             className="flex items-center justify-start w-full gap-2 px-2 py-1 transition-all duration-300 rounded-md hover:bg-dark700">
                             <img src={option.icon} alt="" className="w-5 h-auto"/>
                             <p className="text-sm text-white capitalize">{option.text}</p>
                         </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w-full comment-content">
                {/* <div className="w-full banner h-[150px] flex items-center justify-left">
                    <img src={banner1} alt="" className="object-contain h-full rounded" />
                </div> */}
                <div className="comment-body">
                    <p className="text-sm text-white">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatum doloremque provident et sequi quod enim perferendis sint, quo itaque aspernatur ipsam magni sit distinctio, nemo dolore odio nam saepe iusto.
                    </p>
                </div>
            </div>
            <CommentActions/>
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
            {/* comment reply */}
            <Reply/>
            </div>
        </div>
        
        </>
    )
}
export default Comment;
