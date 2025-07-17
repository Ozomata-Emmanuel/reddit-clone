import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';

const HomeSideBar = () => {
  const [openSections, setOpenSections] = useState({
    topics: true,
    resources: true,
    internetCulture: false,
    games: false,
    qas: false,
    technology: false,
    popCulture: false,
    moviesTv: false
  });
  const location = useLocation();
  

  const isHome = location.pathname.startsWith('/')

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className='bg-white left-0 fixed top-14 w-[270px] pr-7 hover:pr-3 pl-4 py-4 h-[91.2vh] overflow-y-hidden hover:overflow-y-visible hover:overflow-x-hidden'>
      <div className="border-b border-gray-300 pb-3">
        <Link to="/">
          {
            isHome && location.pathname.length > 2  ? (
              <div className="rounded-md flex h-10 px-4 items-center">
                <img className='w-[25px] h-[25px]' src="https://img.icons8.com/?size=100&id=86527&format=png&color=000000" alt="" />
                <h4 className='text-sm ml-3'>Home</h4>
              </div>
            ) : (
              <div className="rounded-md flex bg-[#e5ebee] h-10 px-4 items-center">
                <img className='w-[25px] h-[25px]' src="https://img.icons8.com/?size=100&id=86527&format=png&color=000000" alt="" />
                <h4 className='text-sm ml-3'>Home</h4>
              </div>
            )
          }
        </Link>
        <div className="rounded-md flex bg-white hover:bg-[#f8fafc] h-10 px-4 items-center">
          <img className='w-[25px] h-[25px]' src="https://img.icons8.com/?size=100&id=14919&format=png&color=000000" alt="" />
          <h4 className='text-sm ml-3'>Popular</h4>
        </div>
      </div>
      
      <div className=" text-gray-800">
        {/* TOPICS Section */}
        <div className="mb-4 py-2 border-b-1 border-gray-300">
          <h2>
            <button 
              onClick={() => toggleSection('topics')}
              className="flex items-center justify-between w-full px-3 py-3 rounded-lg hover:bg-gray-50 text-[#98a5a8] text-sm"
            >
              <span>TOPICS</span>
              <img 
                className={`w-4 h-4 shrink-0 transition-transform ${openSections.topics ? 'rotate-180' : ''}`} 
                src="https://img.icons8.com/?size=100&id=41196&format=png&color=000000" 
                alt=""
              />
            </button>
          </h2>
          
          {openSections.topics && (
            <div className=" space-y-2 mt-2">
              {/* Internet Culture (Viral) */}
              <div>
                <button 
                  onClick={() => toggleSection('internetCulture')}
                  className="flex items-center justify-between w-full py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer text-left"
                >
                  <span>Internet Culture (Viral)</span>
                  <img 
                    className={`w-3 h-3 shrink-0 transition-transform ${openSections.internetCulture ? 'rotate-180' : ''}`}
                    src="https://img.icons8.com/?size=100&id=41196&format=png&color=000000" 
                    alt=""
                  />
                </button>
                {openSections.internetCulture && (
                  <div className="pl-4 mt-1 space-y-1">
                    <div className="py-1 px-2 rounded hover:bg-gray-100 cursor-pointer">Memes</div>
                    <div className="py-1 px-2 rounded hover:bg-gray-100 cursor-pointer">Trends</div>
                    <div className="py-1 px-2 rounded hover:bg-gray-100 cursor-pointer">Viral Posts</div>
                  </div>
                )}
              </div>

              {/* Games */}
              <div>
                <button 
                  onClick={() => toggleSection('games')}
                  className="flex items-center justify-between w-full py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer text-left"
                >
                  <span>Games</span>
                  <img 
                    className={`w-3 h-3 shrink-0 transition-transform ${openSections.games ? 'rotate-180' : ''}`}
                    src="https://img.icons8.com/?size=100&id=41196&format=png&color=000000" 
                    alt=""
                  />
                </button>
                {openSections.games && (
                  <div className="pl-4 mt-1 space-y-1">
                    <div className="py-1 px-2 rounded hover:bg-gray-100 cursor-pointer">PC</div>
                    <div className="py-1 px-2 rounded hover:bg-gray-100 cursor-pointer">Console</div>
                    <div className="py-1 px-2 rounded hover:bg-gray-100 cursor-pointer">Mobile</div>
                  </div>
                )}
              </div>

              {/* Q&As */}
              <div className="py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer">Q&As</div>

              {/* Technology */}
              <div>
                <button 
                  onClick={() => toggleSection('technology')}
                  className="flex items-center justify-between w-full py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer text-left"
                >
                  <span>Technology</span>
                  <img 
                    className={`w-3 h-3 shrink-0 transition-transform ${openSections.technology ? 'rotate-180' : ''}`}
                    src="https://img.icons8.com/?size=100&id=41196&format=png&color=000000" 
                    alt=""
                  />
                </button>
                {openSections.technology && (
                  <div className="pl-4 mt-1 space-y-1">
                    <div className="py-1 px-2 rounded hover:bg-gray-100 cursor-pointer">AI</div>
                    <div className="py-1 px-2 rounded hover:bg-gray-100 cursor-pointer">Programming</div>
                    <div className="py-1 px-2 rounded hover:bg-gray-100 cursor-pointer">Gadgets</div>
                  </div>
                )}
              </div>

              {/* Pop Culture */}
              <div className="py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer">Pop Culture</div>

              {/* Movies & TV */}
              <div className="py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer">Movies & TV</div>

              {/* See more */}
              <div className="py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer">See more</div>
            </div>
          )}
        </div>

        {/* RESOURCES Section */}
        <div className="mt-4">
          <h2>
            <button 
              onClick={() => toggleSection('resources')}
              className="flex items-center justify-between w-full px-4 hover:bg-gray-50 rounded-lg py-3 text-[#98a5a8] text-sm"
            >
              <span>RESOURCES</span>
              <img 
                className={`w-4 h-4 shrink-0 transition-transform ${openSections.resources ? 'rotate-180' : ''}`} 
                src="https://img.icons8.com/?size=100&id=41196&format=png&color=000000" 
                alt=""
              />
            </button>
          </h2>
          
          {openSections.resources && (
            <div className="pl-2 space-y-2 mt-2">
              <div className="py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer">About Reddit</div>
              <div className="py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer">Advertise</div>
              <div className="py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer">Reddit Pro BETA</div>
              <div className="py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer">Help</div>
              <div className="py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer">Blog</div>
              <div className="py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer">Careers</div>
              <div className="py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer">Press</div>
              <div className="py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer">Communities</div>
              <div className="py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer">Best of Reddit</div>
              <div className="py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer">Topics</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomeSideBar