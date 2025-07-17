import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import HomeSideBar from "../components/HomeSideBar";
import HomePageRight from "../components/HomePageRight";
import { AiOutlineMenu } from "react-icons/ai";
import { RxViewHorizontal } from "react-icons/rx";
import { MdKeyboardArrowDown } from "react-icons/md";
import { LuArrowBigUp } from "react-icons/lu";
import { LuArrowBigDown } from "react-icons/lu";
import { TbArrowBigDownFilled } from "react-icons/tb";
import { TbArrowBigUpFilled } from "react-icons/tb";
import { IoArrowRedoOutline } from "react-icons/io5";
import { RiLoader5Fill } from "react-icons/ri";
import { RiLoader4Fill } from "react-icons/ri";
import { TbLoader2 } from "react-icons/tb";
import { TbLoader3 } from "react-icons/tb";
import { FaRegComment } from "react-icons/fa6";
import { LiaAwardSolid } from "react-icons/lia";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [postComments, setPostComments] = useState({});
  const [postUsers, setPostUsers] = useState({});
  const navigate = useNavigate();

  const getAllPosts = async () => {
    try {
      setLoading(true)
      const postsResp = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/reddit/api/posts/all`
      );

      if (postsResp.data.success) {
        const posts = postsResp.data.data.map((post) => ({
          ...post,
          score: (post.likes?.length || 0) - (post.dislikes?.length || 0),
        }));
        setAllPosts(posts);

        const commentsPromises = posts.map(async (post) => {
          try {
            const commentsResp = await axios.get(
              `${process.env.REACT_APP_API_BASE_URL}/reddit/api/posts/comments/${post._id}`
            );
            return {
              postId: post._id,
              comments: commentsResp.data.success ? commentsResp.data.data : [],
            };
          } catch (error) {
            console.error(
              `Error fetching comments for post ${post._id}:`,
              error
            );
            return { postId: post._id, comments: [] };
          }
        });

        const validUserIds = posts
          .map((post) => post.user_id)
          .filter((userId) => userId && typeof userId === "string");

        const uniqueUserIds = [...new Set(validUserIds)];

        const userPromises = uniqueUserIds.map(async (userId) => {
          try {
            const userResp = await axios.get(
              `${process.env.REACT_APP_API_BASE_URL}/reddit/api/user/${userId}`
            );

            const userData = userResp.data.data;
            return { userId, user: userData || null };
          } catch (error) {
            console.error(`Error fetching user with ID ${userId}:`, error);
            return { userId, user: null };
          }
        });

        const [commentsResults, usersResults] = await Promise.all([
          Promise.all(commentsPromises),
          Promise.all(userPromises),
        ]);

        const commentsMap = commentsResults.reduce((acc, result) => {
          acc[result.postId] = result.comments;
          return acc;
        }, {});

        const usersMap = usersResults.reduce((acc, result) => {
          if (result.user) {
            acc[result.userId] = {
              username: result.user.username || "unknown",
              avatar: result.user.avatar,
            };
          }
          return acc;
        }, {});

        setPostComments(commentsMap);
        setPostUsers(usersMap);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleVote = async (postId, action) => {
    const userId = localStorage.getItem("reddit_user_id");
    if (!userId) {
      toast.error("Please log in to vote");
      return;
    }

    setAllPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post._id === postId) {
          let newLikes = [...(post.likes || [])];
          let newDislikes = [...(post.dislikes || [])];

          if (action === "like") {
            newDislikes = newDislikes.filter((id) => id !== userId);
          } else {
            newLikes = newLikes.filter((id) => id !== userId);
          }

          const targetArray = action === "like" ? newLikes : newDislikes;
          const userIndex = targetArray.indexOf(userId);

          if (userIndex === -1) {
            targetArray.push(userId);
          } else {
            targetArray.splice(userIndex, 1);
          }

          const score = newLikes.length - newDislikes.length;

          return {
            ...post,
            likes: newLikes,
            dislikes: newDislikes,
            score,
          };
        }
        return post;
      })
    );

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/reddit/api/posts/${postId}/vote?action=${action}`,
        { userId }
      );

      if (!response.data.success) {
        getAllPosts();
      }
    } catch (error) {
      console.error("Voting error:", error);
      getAllPosts()
    }
  };

  return (
    <>
      <div className="flex max-w-full">
        <div className=" hidden lg:block md:block ">
          {isSidebarOpen && (
            <div className="w-[220px]">
              <HomeSideBar />
            </div>
          )}
        </div>
        <div className="lg:w-[70%] md:w-[100%] w-[100%] lg:ml-[20px] md:ml-[10px] lg:mx-auto px-2 lg:px-7 md:px-5 mt-14 relative">
          <div className="border-gray-300 border-l-1 hidden lg:block md:block w-6 h-screen fixed">
            <div
              className="absolute top-5 left-[-15px] w-8 h-8 border-gray-600 border-1 rounded-full bg-white flex justify-center items-center cursor-pointer"
              onClick={toggleSidebar}
            >
              <AiOutlineMenu className="text-black" />
            </div>
          </div>
          <div className="lg:ml-10  md:ml-6">
            <div className="w-[100%] mb-2 border-b-1 py-2 border-gray-300">
              <div className="flex w-[100%] text-gray-500 items-center px-3 py-2 hover:bg-gray-200 rounded-full">
                <RxViewHorizontal className="text-xl mr-1 font-[300]" />
                <MdKeyboardArrowDown className="text-lg" />
              </div>
            </div>
            <div className="POST">
              {
                loading ? (
                  <div className="flex justify-center items-center h-screen">
                    <div className="relative flex items-center justify-center">
                      <RiLoader4Fill className="text-[150px] animate-spin text-orange-500" />
                      <RiLoader5Fill className="absolute text-[60px] animate-spin text-orange-600" />
                      <TbLoader2 className="absolute text-[200px] animate-spin text-orange-300" />
                      <TbLoader3 className="absolute text-[40px] animate-spin text-orange-800" />
                    </div>
                  </div>
                ) : (
                  allPosts.map((post) => (
                    <div className="z-10" key={post._id}>
                      <div className="border-b-1 border-gray-300  py-2">
                        <div className="hover:bg-gray-50 px-3 py-2 rounded-xl cursor-pointer">
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <img
                                className="bg-gray-200 z-30 w-8 h-8 rounded-full"
                                onClick={() =>
                                  navigate(`/user_profile/${post.user_id}`)
                                }
                                src={
                                  postUsers[post.user_id]?.avatar &&
                                  postUsers[post.user_id].avatar.includes("uploads")
                                    ? `${process.env.REACT_APP_API_BASE_URL}/${
                                        postUsers[post.user_id].avatar
                                      }`
                                    : postUsers[post.user_id]?.avatar
                                }
                                alt="User avatar"
                              />
                              <p className="text-[12px] font-semibold ml-2">
                                u/{postUsers[post.user_id]?.username || "user"}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <p className="text-sm text-white px-3 py-[2px] bg-blue-900 rounded-full">
                                Join
                              </p>
                              <img
                                className="w-4 ml-3"
                                src="https://img.icons8.com/?size=100&id=61873&format=png&color=000000"
                                alt=""
                              />
                            </div>
                          </div>
                          <div
                            onClick={() => navigate(`/post/${post._id}`)}
                            className="flex justify-between mt-2"
                          >
                            <div className="mb-3 w-full">
                              <h1 className="font-semibold text-gray-600 text-xl">
                                {post.title}
                              </h1>
                              <h1 className="my-2 text-gray-600 text-">
                                {post.text}
                              </h1>
                              <Link to={post.link}>
                                <p
                                  onClick={() => navigate(post.link)}
                                  className="text-sm text-blue-700 font-semibold hover:underline"
                                >
                                  {post.link}
                                </p>
                              </Link>
                              <div className="w-full">
                                <div className="w-full">
                                  {post.image ? (
                                    post.image === "null" ? (
                                      <div className=""></div>
                                    ) : (
                                      <div className="rounded-lg w-full overflow-hidden flex justify-center items-center">
                                        <img
                                          className="w-full"
                                          src={
                                            post.image.includes("uploads")
                                              ? `${process.env.REACT_APP_API_BASE_URL}/${post.image}`
                                              : post.image
                                          }
                                          alt={post.image}
                                        />
                                      </div>
                                    )
                                  ) : (
                                    <div className=""></div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 lg:justify-between lg:w-70 md:gap-3  ">
                            <div
                              className={`flex items-center rounded-full text-gray-500 gap-1 ${
                                post.likes.includes(
                                  localStorage.getItem("reddit_user_id")
                                )
                                  ? "bg-[#d93900] text-white"
                                  : "text-gray-500 "
                              } ${
                                post.dislikes.includes(
                                  localStorage.getItem("reddit_user_id")
                                )
                                  ? "bg-[#6a5cff] text-white"
                                  : "text-gray-500 "
                              }`}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVote(post._id, "like");
                                }}
                                className={`p-2 rounded-full ${
                                  post.likes.includes(
                                    localStorage.getItem("reddit_user_id")
                                  )
                                    ? "hover:bg-[#00000025] text-white"
                                    : "text-gray-500 hover:bg-[#00000025]"
                                }`}
                              >
                                {post.likes.includes(
                                  localStorage.getItem("reddit_user_id")
                                ) ? (
                                  <TbArrowBigUpFilled className="text-lg" />
                                ) : (
                                  <LuArrowBigUp className="text-lg" />
                                )}
                              </button>
    
                              <span
                                className={`text-xs font-medium min-w-[20px] text-center ${
                                  post.likes.includes(
                                    localStorage.getItem("reddit_user_id")
                                  )  || post.dislikes.includes(
                                    localStorage.getItem("reddit_user_id")
                                  )  
                                    ? "text-[#ffffff]"
                                    : "text-gray-500"
                                }`}
                              >
                                {post.likes.length - post.dislikes.length}
                              </span>
    
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVote(post._id, "dislike");
                                }}
                                className={`p-2 rounded-full ${
                                  post.dislikes.includes(
                                    localStorage.getItem("reddit_user_id")
                                  )
                                    ? "hover:bg-[#00000025] text-white"
                                    : "text-gray-500 hover:bg-[#00000025]"
                                }`}
                              >
                                {post.dislikes.includes(
                                  localStorage.getItem("reddit_user_id")
                                ) ? (
                                  <TbArrowBigDownFilled className="text-lg" />
                                ) : (
                                  <LuArrowBigDown className="text-lg" />
                                )}
                              </button>
                            </div>
    
                            <div className="flex p-2 items-center bg-[#e5ebee] rounded-full  ">
                              <div className="pl-1">
                                <FaRegComment className="text-black" />
                              </div>
                              <p className="text-[12px] font-semibold px-2">
                                {postComments[post._id]?.length || 0}
                              </p>
                            </div>
                            <div className="flex p-2 items-center bg-[#e5ebee] rounded-full  ">
                              <div className="px-1">
                                <LiaAwardSolid className="text-black text-lg" />
                              </div>
                            </div>
                            <div className="flex items-center bg-[#e5ebee] rounded-full  ">
                              <div className="text-black  rounded-full hover:bg-[#d6d6d6] py-2 pr-2 pl-3 hover:text-[#ff4141]">
                                <IoArrowRedoOutline />
                              </div>
                              <p className="text-[12px] font-semibold pr-2">
                                Share
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )
              }
            </div>
          </div>
        </div>
        <div className="lg:w-[280px] hidden lg:block mr-30">
          <HomePageRight />
        </div>
      </div>
    </>
  );
};

export default HomePage;
