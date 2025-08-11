import React from 'react'
import { font } from '../Font/font'
import { CiDeliveryTruck } from "react-icons/ci";
import { GiReturnArrow } from "react-icons/gi";
import { MdOutlineVerified } from "react-icons/md";

const QualitiesBar = () => {
  return (
    <div className={`custom-grey-bg w-full ${font.className} text-black p-2 md:p-3 flex justify-center items-center`}>
        <div className='space-x-4 md:space-x-8 lg:space-x-16 font-bold flex flex-wrap justify-center items-center gap-y-2'>
            <div className='flex justify-center items-center space-x-2 md:space-x-3'>
                <CiDeliveryTruck className='text-xl md:text-2xl lg:text-3xl'/>
                <p className='text-[15px] md:text-[15px] whitespace-nowrap'>Free Delivery</p>
            </div>
            <div className='flex justify-center items-center space-x-2 md:space-x-3'>
                <GiReturnArrow className='text-lg md:text-xl lg:text-2xl'/>
                <p className='text-[15px] md:text-[15px] whitespace-nowrap'>10 Days To Return</p>
            </div>
            <div className='flex justify-center items-center space-x-2 md:space-x-3'>
                <MdOutlineVerified className='text-lg md:text-xl lg:text-2xl' />
                <p className='text-[15px] md:text-[15px] whitespace-nowrap'>12 Month Warranty</p>
            </div>
        </div>
    </div>
  )
}

export default QualitiesBar