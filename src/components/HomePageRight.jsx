import React from 'react'

const HomePageRight = () => {
  return (
    <>
    <div className="">
      <div className="w-[350px] fixed top-14 py-4 pr-4 bg-white h-[91.2vh]">
        <div className="bg-[#f6f8f9] w-[100%] py-2 px-3 rounded-xl">
          <h2 className='text-[12px] text-gray-500 font-semibold'>POPULAR COMMUNITIES</h2>
          <div className='grid grid-cols-1 px-3 mt-9 gap-[15px]'>
            <div className="flex items-center">
              <div className="rounded-full h-9 w-9 overflow-hidden flex justify-center items-center"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzgN0sTLe3Edm2n4lmgSsltegXxvhhSEDuCQ&s" alt="" /></div>
              <div className='ml-2'>
                <p className='text-[14px] text-gray-600'>r/AskMen</p>
                <p className='text-[13px] text-gray-500'>6,766,506 members</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="rounded-full h-9 w-9 overflow-hidden flex justify-center items-center"><img src="https://i.redd.it/snoovatar/avatars/9d16b59e-f884-4baf-8db2-9df55bf58613.png" alt="" /></div>
              <div className='ml-2'>
                <p className='text-[15px] text-gray-600'>r/AskWomen</p>
                <p className='text-[13px] text-gray-500'>5,556,146 members</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="rounded-full h-9 w-9 overflow-hidden flex justify-center items-center"><img src="https://pbs.twimg.com/profile_images/913358575938015232/tYGZrx0Y_400x400.jpg" alt="" /></div>
              <div className='ml-2'>
                <p className='text-[15px] text-gray-600'>r/PS4</p>
                <p className='text-[13px] text-gray-500'>5,532,810 members</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="rounded-full h-9 w-9 overflow-hidden flex justify-center items-center"><img src="https://pyxis.nymag.com/v1/imgs/afa/fd8/58cde64226fec9a6945950c4f72bf772ad-reddit.rsquare.w700.jpg" alt="" /></div>
              <div className='ml-2'>
                <p className='text-[15px] text-gray-600'>r/apple</p>
                <p className='text-[13px] text-gray-500'>6,223,116 members</p>
              </div>
            </div>
            {/* <div className="flex items-center">
              <div className="rounded-full h-9 w-9 overflow-hidden flex justify-center items-center"><img src="https://styles.redditmedia.com/t5_2s84e/styles/communityIcon_ml4cqjrh42gd1.jpg?width=96&height=96&frame=1&auto=webp&crop=96:96,smart&s=b843928064d6fad302ec03baf0a0b6190e616ec4" alt="" /></div>
              <div className='ml-2'>
                <p className='text-[15px] text-gray-600'>r/NBA2K</p>
                <p className='text-[13px] text-gray-500'>713,873 members</p>
              </div>
            </div> */}
            <p className='text-[12px] font-semibold pb-3'>See more</p>
          </div>
        </div>
        <div className="text-[12px] bottom-5 text-gray-500 absolute w-[330px]">
          <div className="flex w-[80%] justify-between mb-2">
            <p className='hover:text-black hover:underline cursor-pointer'>Reddit Rules</p>
            <p className='hover:text-black hover:underline cursor-pointer'>Privacy Policy</p>
            <p className='hover:text-black hover:underline cursor-pointer'>User Agreement</p>
          </div>
          <p className='hover:text-black hover:underline cursor-pointer'>Reddit, Inc. © 2025. All rights reserved.</p>
        </div>
      </div>
    </div>
    </>
  )
}

export default HomePageRight
