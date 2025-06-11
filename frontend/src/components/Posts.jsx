import React from 'react'
import { useEffect } from 'react'
import Votes from './Votes'
import {Link} from 'react-router-dom'

// data
import { posts } from '../data/posts'

const Posts = ({onPostClick}) => {
    const truncateText = (text, maxLength = 100) => {
        if (text.length <= maxLength) return text;
        return `${text.substring(0, maxLength)}...`;
      };
      
    return (
        <div className="grid grid-cols-1 gap-4 pb-3 posts-container sm:grid-cols-2 lg:grid-cols-4">
            {posts.map((post, index) => (
                <div 
                key={post.id} 
                className="flex flex-col items-center justify-center gap-1 border rounded-lg bg-dark800 border-border02 post-card hover:translate-y-[-5px] hover:border-electric transition-all duration-300"
                onClick={() => onPostClick(post, index)}
                style = {{cursor: 'pointer'}}
                >
                {/* post header */}
                <div className="w-full p-2 post-header">
                    <Link to={'/'} className='flex items-start gap-2'>
                        <img src={post.author.image} alt="post1" className="w-10 h-10 rounded-full" />
                        <div className="flex flex-col gap2">
                            <h1 className='text-lg font-bold text-white'>{post.author.authorname}</h1>
                            <p className='text-sm text-gray-400 mt-[-5px]'>{post.author.handle}</p>
                        </div>
                    </Link>
                </div>
                {/* post contents */}
                <div className="flex-grow contents-container">
                    <div className="w-full px-2 text-lg font-semibold text-white capitalize title">
                        <h1>{post.title}</h1>
                    </div>
                    <div className="w-full post-banner pb-1 h-[150px] px-2">
                        <img src={post.postBanner} alt="post1" className="object-cover w-full h-full rounded-md" />
                    </div>
                    <div className="px-2 pb-2 post-description">
                        <p className="text-sm text-white post-content"> {truncateText(post.content, 120)}</p>
                    </div>
                </div>
                {/* post actions */}
                <div className="flex items-center justify-between w-full p-2 post-actions">
                    <Link to={'/'} className="flex items-center gap-2 p-1 pr-2 rounded-md post-group justify-left bg-dark700">
                        <img src={post.group.groupIcon} alt="" className='w-6 h-6' />
                        <p className='text-[10px] text-border'>{post.group.groupName}</p>
                    </Link>
                    <div className="flex items-center gap-2 user-acts justify-right">
                        <Votes votes={post.votes} comments={post.comments}/>
                    </div>
                </div>
            </div>
            ))}
            
        </div>
    )
}

export default Posts;