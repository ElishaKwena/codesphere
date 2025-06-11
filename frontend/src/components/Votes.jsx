import like from '../assets/icons/like.png'
import commentsicon from '../assets/icons/comments.png'


const Votes = ({votes,comments}) =>{
    return(
        <>
        <div className="flex items-center gap-2 user-acts justify-right">
            <div className="flex items-center gap-1 p-[1px] border rounded-[3px] votes border-border02">
                <button className="pointer flex items-center justify-center p-1 border rounded-[3px] border-border02">
                    <img src={like} alt="" className='w-5 h-5' />
                </button>
                <span className='text-sm text-border'>{votes}</span>
                <button className="pointer flex items-center justify-center p-1 border rounded-[3px] border-border02">
                    <img src={like} alt="" className='w-5 h-5 rotate-180' />
                </button>
            </div>
            <div className="comments">
                <button className="pointer flex items-center justify-center p-1 border rounded-[3px] border-border02">
                    <img src={commentsicon} alt="" className='w-6 h-6' />
                    <span className='text-sm text-border'>{comments}</span>
                </button>
            </div>
        </div>

        </>
    )
}
export default Votes;