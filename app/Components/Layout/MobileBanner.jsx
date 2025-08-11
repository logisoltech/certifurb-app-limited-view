"use client";

import React from 'react';
import { FaRegCheckCircle, FaRegStar, FaRegLifeRing, FaRegSmile } from "react-icons/fa";
import { font } from '../Font/font';

const infoItems = [
  {
    icon: <FaRegCheckCircle className="text-green-500 text-3xl mb-2" />,
    title: 'Risk Free',
    desc: '10 days to return in case of any issue',
  },
  {
    icon: <FaRegCheckCircle className="text-green-500 text-3xl mb-2" />,
    title: 'Verified Devices- One by One',
    desc: '50 points quality check on all aspects of the device (screen, battery, speed, durability,...)',
  },
  {
    icon: <FaRegStar className="text-green-500 text-3xl mb-2" />,
    title: 'Only from the best',
    desc: 'Rigorous screening process - Only 1 out of 4 suppliers is accepted on Certifurb.',
  },
  {
    icon: <FaRegLifeRing className="text-green-500 text-3xl mb-2" />,
    title: 'Always here for you',
    desc: 'Proactive customer service to answer and solve any concern',
  },
];

const MobileBanner = () => {
  return (
    <div className={`${font.className}  dark:text-black bg-gray-100 w-full py-12 px-12 `}>
      <h2 className="text-center font-extrabold text-3xl mb-8">ALL OUR DEVICES ARE ORIGINAL AND VERIFIED BY EXPERTS</h2>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Left Info */}
        <div className="flex flex-col gap-12 flex-1 max-w-xs">
          <div className="flex flex-col items-center text-center">
            {infoItems[0].icon}
            <span className="font-extrabold text-lg">{infoItems[0].title}</span>
            <span className="text-sm mt-1">{infoItems[0].desc}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            {infoItems[1].icon}
            <span className="font-extrabold text-lg">{infoItems[1].title}</span>
            <span className="text-sm mt-1">{infoItems[1].desc}</span>
          </div>
        </div>
        {/* Center Image */}
        <div className="flex-1 flex justify-center">
          <img src="/banner.png" alt="Mobile Banner" className="max-h-72 md:max-h-96 object-contain" />
        </div>
        {/* Right Info */}
        <div className="flex flex-col gap-12 flex-1 max-w-xs">
          <div className="flex flex-col items-center text-center">
            {infoItems[2].icon}
            <span className="font-extrabold text-lg">{infoItems[2].title}</span>
            <span className="text-sm mt-1">{infoItems[2].desc}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            {infoItems[3].icon}
            <span className="font-extrabold text-lg">{infoItems[3].title}</span>
            <span className="text-sm mt-1">{infoItems[3].desc}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileBanner;