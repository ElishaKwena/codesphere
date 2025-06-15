import React from 'react'
import { Link } from 'react-router-dom'

import postsicon from '../../assets/icons/posts.png'
import members from '../../assets/icons/members.png'
// data
import { usergroups } from '../../data/usergroups'
import { formatSocialNumber } from '../../utils/formatNumbers';
import {textsCounter} from '../../utils/textsFormatter';

import {recommended} from '../../data/usergroups'

import profile1 from '../../assets/images/user4.png'
import profile2 from '../../assets/images/user5.png'
import profile3 from '../../assets/images/user6.png'
import profile from '../../assets/images/user2.png'

const f4Users = [
    { id: 1, profilePic: profile1 },
    { id: 2, profilePic: profile2 },
    { id: 3, profilePic: profile3 },
    { id: 4, profilePic: profile }
  ];
const Group = ({group}) =>{
    const getRole = () =>{
        switch(group.role.toLowerCase()){
            case 'admin':
                return "text-purple rounded-full border border-purple py-1";
            case 'owner':
                return "text-electric rounded-full border border-electric py-1";
            case 'member':
                return "text-border/50 rounded-full border border-border/50 py-1";
        }
    }

    return(
        <div
            className="flex flex-col gap-1 transition-all duration-300 border bg-dark800 rounded-md group-box border-border02 hover:translate-y-[-5px] hover:border-electric">
              <div className="flex items-center justify-between gap-2 p-3 pt-2 header ">
                  <div className="flex items-center justify-between gap-2 group-icon">
                      <img src={group.icon} alt="" className="w-16 h-auto rounded-md"/>
                      <h1 className="text-xl font-bold text-white text-wrap">{group.name}</h1>
                  </div>
                  <div className={`flex items-center justify-center p-2 font-bold rounded-full role text-md ${getRole()}`}>{group.role}</div>
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
                      <img src={postsicon} alt="" className='w-5 h-auto'/>
                      <p className="text-sm text-border">{formatSocialNumber(group.posts)} posts</p>
                  </div>
                  <div className="group-type">
                      <p className="text-border">{group.type} group</p>
                  </div>
              </div>
          </div>
    );
}

const Recommended = ({recommended}) =>{
    return(
        <Link to ="" className="flex flex-col gap-1 p-2 transition-all duration-300 border rounded-md border-border02 bg-dark800 hover:border-electric">
            <div className="flex items-center justify-start flex-grow gap-2">
                <img src={recommended.icon} alt=""  className="w-16 h-auto rounded-md"/>
                <h1 className="text-lg text-white capitalize">{recommended.name}</h1>
            </div>
            <p className="text-border">{formatSocialNumber(recommended.members)} members</p>
        </Link>
    )
}
const UserGroups = () =>{

    

    return(
        <main className="pt-[90px] h-full md:h-screen w-full bg-dark900 gap-2 px-1">
            <div className="w-full mx-auto flex items-center justify-between md:w-[95%] py-2">
                <h1 className="text-xl text-white capitalize">Your groups</h1>
                <button className="p-2 text-white rounded-md bg-electric">Create group</button>
            </div>
            <div className="grid flex-grow grid-cols-1 gap-4 pb-3 mt-3 md:w-[95%] mx-auto w-full posts-container sm:grid-cols-2 lg:grid-cols-4">
                {usergroups && usergroups.map((group) => (
                    <Group group={group} key={group.id} />  // Pass group data and key
                ))}
            </div>
            <div className="md:w-[95%] mx-auto">
                <div>
                <h1 className='text-2xl font-bold text-white md:text-2xl'>Recommended Grooups</h1>
                </div>
                <div className="grid flex-grow w-full grid-cols-2 gap-4 pb-3 mx-auto mt-3 posts-container sm:grid-cols-2 lg:grid-cols-5">
                    {recommended && recommended.map((group) => (
                        <Recommended recommended={group} key={group.id} />
                    ))}
                </div>
            </div>
        </main>
    )
}
export default UserGroups;