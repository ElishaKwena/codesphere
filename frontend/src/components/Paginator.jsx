import React from 'react'
import arrow from '../assets/icons/dropdown.png'
const Paginator =  () =>{
    return(
        <>
        <div className="flex items-center justify-center w-full p-2 paginator">
            <div className="flex items-center justify-between gap-2 pagesdiv">
                <button className="flex items-center justify-center p-1 transition-all duration-300 border rounded-md border-border02 hover:bg-dark800">
                    <img src={arrow} alt="" className="w-6 h-auto rotate-90"/>
                </button>
                <button className="flex items-center justify-center p-1 border rounded-md border-border02 w-[35px] hover:bg-dark800 transition-all duration-300 group">
                    <h1 className="font-bold text-white group-hover:text-electric">1</h1>
                </button>
                <button className="flex items-center justify-center p-1 border rounded-md border-border02 w-[35px] hover:bg-dark800 transition-all duration-300 group">
                    <h1 className="font-bold text-white group-hover:text-electric">2</h1>
                </button>
                <button className="flex items-center justify-center p-1 border rounded-md border-border02 w-[35px] hover:bg-dark800 transition-all duration-300 group">
                    <h1 className="font-bold text-white group-hover:text-electric">3</h1>
                </button>
                <button className="flex items-center justify-center p-1 border rounded-md border-border02 w-[35px] hover:bg-dark800 transition-all duration-300 group">
                    <h1 className="font-bold text-white group-hover:text-electric">1</h1>
                </button>
                <button className="flex items-center justify-center p-1 border rounded-md border-border02 w-[35px] hover:bg-dark800 transition-all duration-300 group">
                    <h1 className="font-bold text-white group-hover:text-electric">4</h1>
                </button>
                <button className="flex items-center justify-center p-1 border rounded-md border-border02 w-[35px] hover:bg-dark800 transition-all duration-300 group">
                    <h1 className="font-bold text-white group-hover:text-electric">5</h1>
                </button>
                <button className="flex items-center justify-center p-1 border rounded-md border-border02 w-[35px] hover:bg-dark800 transition-all duration-300 group">
                    <span className="flex items-center justify-center font-bold text-white group-hover:text-electric">...</span>
                </button>
                <button className="flex items-center justify-center p-1 transition-all duration-300 border rounded-md border-border02 hover:bg-dark800">
                    <img src={arrow} alt="" className="w-6 h-auto rotate-[-90deg]"/>
                </button>
            </div>
        </div>
        </>
    )
}
export default Paginator;