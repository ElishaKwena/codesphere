import React from 'react';
import award from '../assets/icons/award.png'
import upvote from '../assets/icons/like.png'
import comment from '../assets/icons/comments.png'


const ReplyActions = () =>{
    return(
        <>
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
        </>
    )
}
export default ReplyActions;




