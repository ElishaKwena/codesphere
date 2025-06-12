import React from 'react'

import { Link } from 'react-router-dom'

// images

import profile1 from '../assets/images/user4.png'
import profile2 from '../assets/images/user5.png'
import profile3 from '../assets/images/user6.png'
import profile from '../assets/images/user2.png'
import posts from '../assets/icons/posts.png'


const f4Users = [
    { id: 1, profilePic: profile1 },
    { id: 2, profilePic: profile2 },
    { id: 3, profilePic: profile3 },
    { id: 4, profilePic: profile }
  ];

import { formatSocialNumber } from '../utils/formatNumbers';
import {textsCounter} from '../utils/textsFormatter';

const Group = ({group}) =>{

    return(
        <>
         <div 
          className="flex flex-col gap-1 transition-all duration-300 border bg-dark800  rounded-md group-box border-border02 hover:translate-y-[-5px] hover:border-electric">
            <div className="flex items-center justify-between gap-2 p-3 pt-2 header ">
                <div className="flex items-center justify-between gap-2 group-icon">
                    <img src={group.icon} alt="" className="w-16 h-auto rounded-md"/>
                    <h1 className="text-xl font-bold text-white text-wrap">{group.name}</h1>
                </div>
                <div className="flex flex-col px-2 border rounded-md members bg-dark800 border-border02">
                    <h1 className="text-center text-md text-border">{formatSocialNumber(group.members)}</h1>
                    <p className="text-[10px] text-white">Members</p>
                </div>
            </div>
            <div className="flex-grow px-3 pb-3 post-contents">
                <p className="text-sm text-border">{textsCounter(group.description)}</p>
            </div>
            <div className="flex items-center justify-between px-2 view">
                <div className="members-box relative w-[120px] h-[40px]">
                {f4Users.map((user, index) => (
                    <div 
                    key={user.id}
                    className="absolute top-0 w-[40px] h-[40px] rounded-full border-2 border-dark900 overflow-hidden"
                    style={{ left: `${index * 25}px` }}>
                        <img 
                            src={user.profilePic} 
                            alt={`user-${user.id}`} 
                            className="object-cover w-full h-full"/>
                    </div>
                ))}
                </div>
                <div>
                    <Link to="" className="left-[100%] text-sm text-electric">View</Link>
                </div>
            </div>
            <div className="flex items-center justify-between w-full p-2 mt-2 border-t rounded-b-md actions border-border02 bg-dark700">
                <div className="flex items-center justify-between gap-2">
                    <img src={posts} alt="" className='w-5 h-auto'/>
                    <p className="text-sm text-border">{formatSocialNumber(group.posts)} posts</p>
                </div>
                <div className="group-type">
                    <p className="text-border">{group.type} group</p>
                </div>
            </div>
          </div>
        </>
    );
}
export default Group;