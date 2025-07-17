import React, { useContext, useEffect, useState } from 'react'
import { PiCameraPlus } from "react-icons/pi";
import { IoArrowRedoOutline } from "react-icons/io5";
import { DataContext } from '../context/DataContext';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const UserPageRight = () => {

  const { user } = useContext(DataContext)
  const { id } = useParams()
  const [userProfile, setUserProfile] = useState({})
  const getUser = async()=> {
    try {
      const resp = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/reddit/api/user/${id}`);
      if (resp.data.success){
        setUserProfile(resp.data.data);
      } else {
        console.log(error)
      }
    } catch (error) {
      console.log(error?.response?.data?.message || error)
      toast.error(error?.response?.data?.message || "Error getting user info", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  useEffect(() => {
    if (id) {
      getUser();
    }
  }, [id]);

  return (
    <>
    <div className="">
      <div className="w-[330px] fixed top-14 py-4 pr-4 bg-white h-[91.2vh]">
        <div className="bg-[#f6f8f9] w-[100%]  rounded-xl">
          <div className="bg-gradient-to-t rounded-t-xl h-25 relative from-black to-blue-900">
            <div className=" bg-[#e5ebee] w-8 h-8 flex absolute justify-center items-center rounded-full bottom-[10px] right-[10px]">
              <PiCameraPlus className='text-[20px]'/>
            </div>
          </div>
          <div className='grid grid-cols-1 py-2 px-6 mt-1 gap-[15px]'>
            <h1 className='font-bold text-[#212121]'>u/{userProfile.username}</h1>
            <div className="flex items-center w-20 bg-[#e5ebee] rounded-full  ">
              <div className='text-black  rounded-full hover:bg-[#d6d6d6] py-2 pr-2 pl-3 hover:text-[#ff4141]'>
                <IoArrowRedoOutline />
              </div>
              <p className='text-[12px] font-semibold pr-2'>Share</p>
            </div>
            <div className="grid gap-4 grid-cols-2 border-b-1 border-gray-300 pb-4">
              <div className="mb-2">
                <h4 className='text-[13px] font-semibold '>1</h4>
                <p className="text-[12px] text-gray-600">Post karma</p>
              </div>
              <div className="mb-2">
                <h4 className='text-[13px] font-semibold '>0</h4>
                <p className="text-[12px] text-gray-600">Comment karma</p>
              </div>
              <div className="">
                <h4 className='text-[13px] font-semibold '>May 17, 2025</h4>
                <p className="text-[12px] text-gray-600">Cake day</p>
              </div>
              <div className="">
                <h4 className='text-[13px] font-semibold '>0</h4>
                <p className="text-[12px] text-gray-600">Gold earned</p>
              </div>
            </div>
            <div className="text-gray-600 border-b-1 border-gray-300 pb-4">
              <h1 className='text-[12px]'>ACHIEVEMENTS</h1>
              <div className="flex relative">
                <img className='w-10 absolute left-[40px]' src="https://preview.redd.it/bsyxm9h7d12d1.png?width=100&height=100&crop=smart&auto=webp&s=4fa41e0cba49b77e2646b640ea373e8e021f4e1f" alt="" />
                <img className='w-10 absolute left-[20px]' src="https://preview.redd.it/t0unzkrohavc1.png?width=100&height=100&crop=smart&auto=webp&s=56d5a81210a834477d1b29f0984ce44a6bc3c7e7" alt="" />
                <img className='w-10 absolute ' src="https://preview.redd.it/fpniflrohavc1.png?width=100&height=100&crop=smart&auto=webp&s=3715dbf286c349f8255a54add53f9d48de18c56d" alt="" />
                <div className='flex justify-end w-full'>
                  <p className="text-[12px] text-gray-700 hover:underline cursor-pointer mr-1">Joined Reddit, </p>
                  <p className="text-[12px] text-gray-700 hover:underline cursor-pointer">Secured Account</p>
                </div>
              </div>
              <div className="full justify-between flex items-center mt-5">
                <p className="text-[12px] text-gray-700">2 unlocked</p>
                <div className="flex items-center w-20 bg-[#e5ebee] rounded-full justify-center">
                  <p className='text-[12px] text-black font-semibold  px-2 py-1'>View All</p>
                </div>
              </div>
            </div>
            <div className="text-gray-600  pb-4">
              <h1 className='text-[12px]'>SETTINGS</h1>
              <div className="full justify-between flex items-center mt-5">
                <div className="flex items-center">
                  <img className='w-9 h-9 rounded-full' src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_7.png" alt="" />
                  <div className="ml-1">
                    <p className="text-[14px] text-gray-900">Profile</p>
                    <p className="text-[12px] text-gray-700">2 unlocked</p>
                  </div>
                </div>
                <div className="flex items-center w-20 bg-[#e5ebee] rounded-full justify-center">
                  <p className='text-[12px] text-black font-semibold  px-2 py-1'>Update</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default UserPageRight
