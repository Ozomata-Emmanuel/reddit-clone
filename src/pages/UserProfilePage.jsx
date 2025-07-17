import React, { useContext, useEffect, useRef, useState } from "react";
import HomeSideBar from "../components/HomeSideBar";
import { AiOutlineMenu } from "react-icons/ai";
import { IoAdd } from "react-icons/io5";
import UserPageRight from "../components/UserPageRight";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PiCameraPlus } from "react-icons/pi";
import { IoArrowUndoOutline } from "react-icons/io5";
import { IoArrowRedoOutline } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa6";
import { LiaAwardSolid } from "react-icons/lia";
import { LuArrowBigUp } from "react-icons/lu";
import { LuArrowBigDown } from "react-icons/lu";
import { BsThreeDots } from "react-icons/bs";
import { DataContext } from "../context/DataContext";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { RiLoader5Fill } from "react-icons/ri";
import { RiLoader4Fill } from "react-icons/ri";
import { TbLoader2 } from "react-icons/tb";
import { TbLoader3 } from "react-icons/tb";
import axios from "axios";
import { toast } from "react-toastify";
import { RiArrowLeftLine } from "react-icons/ri";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(DataContext);
  const [loading, setLoading] = useState(false)
  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [activePostId, setActivePostId] = useState(null);
  const actionBarRef = useRef(null);
  const actionBarPostRef = useRef(null);
  const [postComments, setPostComments] = useState({});
  const [overviewDis, setOverviewDis] = useState(true);
  const [postDis, setPostDis] = useState(false);
  const [commentDis, setCommentDis] = useState(false);
  const [allComments, setAllComments] = useState([]);

  const showOverviewDis = () => {
    setOverviewDis(true);
    setPostDis(false);
    setCommentDis(false);
  };

  const showPostDis = () => {
    setOverviewDis(false);
    setPostDis(true);
    setCommentDis(false);
  };

  const showCommentDis = () => {
    setOverviewDis(false);
    setPostDis(false);
    setCommentDis(true);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        actionBarRef.current &&
        !actionBarRef.current.contains(event.target)
      ) {
        setActiveCommentId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        actionBarPostRef.current &&
        !actionBarPostRef.current.contains(event.target)
      ) {
        setActivePostId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleActionbar = (commentId) => {
    setActiveCommentId(activeCommentId === commentId ? null : commentId);
  };

  const togglePostActionbar = (postId) => {
    setActivePostId(activePostId === postId ? null : postId);
  };

  const localstorageData = localStorage.getItem("reddit_user_id");

  useEffect(() => {
    if (id) {
      getUserPosts();
    }
  }, []);

  const getUserPosts = async () => {
    setLoading(true)
    try {
      const postsResp = await axios.get(
        `https://reddit-clone-backend-sdts.onrender.com/reddit/api/posts/user/${id}`
      );
      if (postsResp.data.success) {
        setUserPosts(postsResp.data.data);
        const commentsPromises = postsResp.data.data.map(async (post) => {
          try {
            const commentsResp = await axios.get(
              `https://reddit-clone-backend-sdts.onrender.com/reddit/api/posts/comments/${post._id}`
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
            return {
              postId: post._id,
              comments: [],
            };
          }
        });

        const commentsResults = await Promise.all(commentsPromises);
        const commentsMap = commentsResults.reduce((acc, result) => {
          acc[result.postId] = result.comments;
          return acc;
        }, {});

        setPostComments(commentsMap);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
    } finally {
      setLoading(false)
    }
  };

  const getUserComments = async (id) => {
    setLoading(true)
    try {
      const resp = await axios.get(
        `https://reddit-clone-backend-sdts.onrender.com/reddit/api/user/comment/${id}`
      );
      if (resp.data.success) {
        setAllComments(resp.data.data);
      }
    } catch (error) {
      console.error("Error fetching user comments:", error);
    } finally {
      setLoading(false)
    }
  };

  const getUser = async () => {
    setLoading(true)
    try {
      const resp = await axios.get(
        `https://reddit-clone-backend-sdts.onrender.com/reddit/api/user/${id}`
      );
      if (resp.data.success) {
        setUserProfile(resp.data.data);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error?.response?.data?.message || error);
      toast.error(error?.response?.data?.message || "Error getting user info", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false)
    }
  };

  const deleteComment = async (commentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (confirmed) {
      setLoading(true)
      try {
        const resp = await axios.delete(
          `https://reddit-clone-backend-sdts.onrender.com/reddit/api/user/comment/${commentId}`
        );
        if (resp.data.success) {
          setAllComments(
            allComments.filter((comment) => comment._id !== commentId)
          );
          toast.success("Comment deleted successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          toast.error("Failed to delete comment", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } catch (error) {
        console.error("Error deleting comment", error);
        toast.error("Error deleting comment", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setLoading(false)
      }
      setActiveCommentId(null);
    } else {
      return;
    }
  };

  const deletePost = async (postId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmed) {
      setLoading(true)
      try {
        const resp = await axios.delete(
          `https://reddit-clone-backend-sdts.onrender.com/reddit/api/posts/delete/${postId}`
        );
        if (resp.data.success) {
          setUserPosts(userPosts.filter((post) => post._id !== postId));
          toast.success("Post deleted successfull", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          toast.error("Failed to delete post", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } catch (error) {
        console.error("Error deleting post", error);
        toast.error("Error deleting post", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setLoading(false)
      }
      setActivePostId(null);
    } else {
      return;
    }
  };

  useEffect(() => {
    if (id) {
      getUserPosts();
      getUser();
      getUserComments(id);
    }
  }, [id]);

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
        <div className="lg:w-[70%] w-full lg:ml-[20px] md:ml-[10px] lg:mx-auto px-2 lg:px-7 md:px-5 mt-14 relative">
          <div className="border-gray-300 border-l-1 hidden lg:block md:block w-6 bg-fuc=hsia-800 h-screen fixed">
            <div
              className="absolute top-5 left-[-15px] w-8 h-8 border-gray-600 border-1 rounded-full bg-white flex justify-center items-center cursor-pointer"
              onClick={toggleSidebar}
            >
              <AiOutlineMenu className="text-black" />
            </div>
          </div>
          <div className="lg:ml-10 md:ml-6">
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
                <div className="USER_PROFILE pb-45">
                  <div className="w-full flex mt-5 items-center">
                    {localstorageData != userProfile.id ? (
                      <div className="">
                        <div
                          onClick={() => navigate(-1)}
                          className="bg-gray-200 cursor-pointer mr-3 flex justify-centre items-centre text-black p-2 rounded-full"
                        >
                          <RiArrowLeftLine />
                        </div>
                      </div>
                    ) : (
                      <div className=""></div>
                    )}
                    <div className="rounded-full relative  w-18 h-18">
                      {localstorageData != userProfile.id ? (
                        <div className=""></div>
                      ) : (
                        <Link to={`/settings/${user.id}`}>
                          <div className="absolute bg-[#e5ebee] p-2 rounded-full bottom-[-10px] right-[-10px]">
                            <PiCameraPlus className="text-xl" />
                          </div>
                        </Link>
                      )}
                      <img
                        className="rounded-full w-18 h-18 border-2 border-gray-300"
                        src={
                          userProfile?.avatar?.includes("uploads")
                            ? `https://reddit-clone-backend-sdts.onrender.com/${userProfile.avatar}`
                            : userProfile.avatar
                        }
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <h1 className="text-[#333d42] text-2xl font-bold">
                        {userProfile.username}
                      </h1>
                      <p className="text-sm text-gray-600 font-semibold">
                        u/{userProfile.username}
                      </p>
                    </div>
                  </div>
                  <div className="w-full overflow-x-hidden">
                    <div className="flex  border-gray-50 md:border-0 lg:border-0 border rounded-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] gap-3 mt-8 whitespace-nowrap">
                      {overviewDis ? (
                        <p className="h-10 flex justify-center items-center font-semibold text-sm px-3 cursor-pointer rounded-full bg-gray-300">
                          Overview
                        </p>
                      ) : (
                        <p
                          onClick={showOverviewDis}
                          className="h-10 flex justify-center items-center hover:underline font-semibold text-sm px-3 cursor-pointer rounded-full "
                        >
                          Overview
                        </p>
                      )}
                      {postDis ? (
                        <p className="h-10 flex justify-center items-center font-semibold text-sm px-3 cursor-pointer rounded-full bg-gray-300">
                          Posts
                        </p>
                      ) : (
                        <p
                          onClick={showPostDis}
                          className="h-10 flex justify-center items-center hover:underline font-semibold text-sm px-3 cursor-pointer rounded-full"
                        >
                          Posts
                        </p>
                      )}
                      {commentDis ? (
                        <p className="h-10 flex justify-center items-center font-semibold text-sm px-3 cursor-pointer rounded-full bg-gray-300">
                          Comments
                        </p>
                      ) : (
                        <p
                          onClick={showCommentDis}
                          className="h-10 flex justify-center items-center hover:underline font-semibold text-sm px-3 cursor-pointer rounded-full"
                        >
                          Comments
                        </p>
                      )}
                      <p className="h-10 flex justify-center items-center hover:underline font-semibold text-sm px-3 cursor-pointer rounded-full">
                        Upvoted
                      </p>
                      <p className="h-10 flex justify-center items-center hover:underline font-semibold text-sm px-3 cursor-pointer rounded-full">
                        Downvoted
                      </p>
                    </div>
                  </div>
                  {localstorageData != userProfile.id ? (
                    <div className=""></div>
                  ) : (
                    <div className="border-b-1 border-gray-300">
                      <div className="flex mt-4 pb-3">
                        <Link to="/create_post">
                          <p className="h-8 flex justify-center items-center hover:border-gray-700 border-1 border-gray-500 font-semibold text-sm px-3 cursor-pointer rounded-full">
                            <IoAdd /> Create post
                          </p>
                        </Link>
                        <p className="h-8 flex justify-center items-center hover:bg-gray-100 font-semibold text-sm px-3 cursor-pointer rounded-full text-gray-600">
                          New
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="pt-5">
                    {(userPosts.length === 0 && overviewDis) ||
                    (userPosts.length === 0 && postDis) ? (
                      <div className="grid grid-cols-1 justify-center">
                        <div className="flex justify-center">
                          <img
                            src="https://www.redditstatic.com/shreddit/assets/hmm-snoo.png"
                            alt=""
                            className="w-20"
                          />
                        </div>
                        <h1 className="font-bold text-center">
                          u/{userProfile.username} hasn't posted yet
                        </h1>
                      </div>
                    ) : allComments.length === 0 && commentDis ? (
                      <div className="grid grid-cols-1 justify-center">
                        <div className="flex justify-center">
                          <img
                            src="https://www.redditstatic.com/shreddit/assets/hmm-snoo.png"
                            alt=""
                            className="w-20"
                          />
                        </div>
                        <h1 className="font-bold text-center">
                          u/{userProfile.username} hasn't commented yet
                        </h1>
                      </div>
                    ) : overviewDis ? (
                      userPosts.map((post) => (
                        <Link key={post._id} to={`/post/${post._id}`}>
                          <div className="border-b-1 border-gray-300  py-2">
                            <div className="hover:bg-gray-100 px-3 py-1 rounded-xl cursor-pointer">
                              <div className="flex justify-between">
                                <div className="flex items-center">
                                  <img
                                    className="rounded-full w-7 h-7"
                                    src={
                                      userProfile?.avatar?.includes("uploads")
                                        ? `https://reddit-clone-backend-sdts.onrender.com/${userProfile.avatar}`
                                        : userProfile.avatar
                                    }
                                    alt=""
                                  />
                                  <p className="text-[12px] font-semibold ml-2">
                                    u/{post.user_name}
                                  </p>
                                </div>
                                <div className="flex items-center">
                                  <p className="text-sm text-white px-3 py-[2px] bg-blue-900 rounded-full">
                                    Join
                                  </p>
                                </div>
                              </div>
                              <div className="flex justify-between mt-2">
                                <div className="mb-3 w-full">
                                  <h1 className="font-semibold text-gray-600 text-xl">
                                    {post.title}
                                  </h1>
                                  <h1 className="my-2 text-gray-600 text-">
                                    {post.text}
                                  </h1>
                                  <p className="text-sm text-blue-700 font-semibold hover:underline">
                                    {post.link}
                                  </p>
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
                                                  ? `https://reddit-clone-backend-sdts.onrender.com/${post.image}`
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
                              <div className="flex justify-between w-70">
                                <div className="flex items-center bg-[#e5ebee] rounded-full  ">
                                  <div className="text-black rotate-90 rounded-full hover:bg-[#d6d6d6] p-2 hover:text-[#ff4141]">
                                    <IoArrowRedoOutline />
                                  </div>
                                  <p className="text-[12px] font-semibold mx-1">
                                    0
                                  </p>
                                  <div className="text-black rotate-90 rounded-full hover:bg-[#d6d6d6] p-2 hover:text-[#042ce2]">
                                    <IoArrowUndoOutline />
                                  </div>
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
                        </Link>
                      ))
                    ) : postDis ? (
                      userPosts.map((post) => (
                        <div key={post._id}>
                          <div className="border-b-1 border-gray-300  py-2">
                            <div className="hover:bg-gray-100 px-3 py-1 rounded-xl cursor-pointer">
                              <div className="flex justify-between">
                                <div className="flex items-center">
                                  <img
                                    className="bg-gray-200 w-6 h-6 rounded-full"
                                    src={
                                      userProfile?.avatar?.includes("uploads")
                                        ? `https://reddit-clone-backend-sdts.onrender.com/${userProfile.avatar}`
                                        : userProfile.avatar
                                    }
                                    alt=""
                                  />
                                  <p className="text-[12px] font-semibold ml-2">
                                    u/{userProfile.username}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3 relative">
                                  <p className="text-sm text-white px-3 py-[2px] bg-blue-900 rounded-full">
                                    Join
                                  </p>
                                  {localstorageData != userProfile.id ? (
                                    <div className=""></div>
                                  ) : (
                                    <div
                                      onClick={() => togglePostActionbar(post._id)}
                                      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-300"
                                    >
                                      <img
                                        className="w-4 mx-auto"
                                        src="https://img.icons8.com/?size=100&id=61873&format=png&color=000000"
                                        alt=""
                                      />
                                    </div>
                                  )}
                                  {activePostId === post._id && (
                                    <div
                                      ref={actionBarPostRef}
                                      className="w-40 bg-white border border-gray-300 shadow-lg rounded-lg absolute right-0 top-8 z-10"
                                    >
                                      <Link
                                        to={`/edit_post/${post._id}`}
                                        className="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100 text-sm font-semibold rounded-t-lg"
                                      >
                                        <FiEdit className="text-[16px]" />
                                        Edit
                                      </Link>
                                      <div
                                        onClick={() => deletePost(post._id)}
                                        className="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100 text-sm font-semibold rounded-b-lg"
                                      >
                                        <RiDeleteBinLine className="text-[16px]" />
                                        Delete
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex justify-between mt-2">
                                <div className="mb-3 w-full">
                                  <h1 className="font-semibold text-gray-600 text-xl">
                                    {post.title}
                                  </h1>
                                  <h1 className="my-2 text-gray-600 text-">
                                    {post.text}
                                  </h1>
                                  <p className="text-sm text-blue-700 font-semibold hover:underline">
                                    {post.link}
                                  </p>
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
                                                  ? `https://reddit-clone-backend-sdts.onrender.com/${post.image}`
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
                              <div className="flex justify-between w-70">
                                <div className="flex items-center bg-[#e5ebee] rounded-full  ">
                                  <div className="text-black rotate-90 rounded-full hover:bg-[#d6d6d6] p-2 hover:text-[#ff4141]">
                                    <IoArrowRedoOutline />
                                  </div>
                                  <p className="text-[12px] font-semibold mx-1">
                                    0
                                  </p>
                                  <div className="text-black rotate-90 rounded-full hover:bg-[#d6d6d6] p-2 hover:text-[#042ce2]">
                                    <IoArrowUndoOutline />
                                  </div>
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
                    ) : (
                      <div className="">
                        {allComments.map((comment) => (
                          <div
                            key={comment._id}
                            className="py-3 border-b-2 border-gray-50"
                          >
                            <div className="border-b-2 border-[#ebebeb11]">
                              <div className="flex w-full items-center relative justify-between">
                                <div className="flex items-center">
                                  <img
                                    className="bg-gray-200 w-8 h-8 rounded-full"
                                    src={
                                      userProfile?.avatar?.includes("uploads")
                                        ? `https://reddit-clone-backend-sdts.onrender.com/${userProfile.avatar}`
                                        : userProfile.avatar
                                    }
                                    alt=""
                                  />
                                  <p className="text-[15px] font-semibold ml-2">
                                    u/{userProfile.username}
                                  </p>
                                </div>
                                {localstorageData != userProfile.id ? (
                                  <div className=""></div>
                                ) : (
                                  <div
                                    onClick={() => toggleActionbar(comment._id)}
                                    className="hover:bg-gray-200 duration-200 p-2 rounded-full cursor-pointer"
                                  >
                                    <BsThreeDots className="text-black text-lg" />
                                  </div>
                                )}
                                {activeCommentId === comment._id && (
                                  <div
                                    ref={actionBarRef}
                                    className="w-40 bg-white border border-gray-300 shadow-lg rounded-lg absolute right-0 top-8 z-10"
                                  >
                                    <div
                                      onClick={() => deleteComment(comment._id)}
                                      className="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100 text-sm font-semibold rounded-b-lg"
                                    >
                                      <RiDeleteBinLine className="text-[16px]" />
                                      Delete
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="mt-[-5px] ml-3.5 rounded-md ">
                                <p
                                  onClick={() =>
                                    navigate(`/post/${comment.post_id}`)
                                  }
                                  className="cursor-pointer text-sm hover:underline font-light px-2 py-3"
                                >
                                  {comment.text}
                                </p>
                                <div className="flex mt-[-5px] ">
                                  <div className="flex items-center rounded-full  ">
                                    <div className="text-gray-500 cursor-pointer text-[20px] rounded-full hover:bg-[#e7e7e7] p-2 hover:text-[#f13030]">
                                      <LuArrowBigUp />
                                    </div>
                                    <p className="text-[12px] font-semibold mx-1">
                                      0
                                    </p>
                                    <div className="text-gray-500 cursor-pointer text-[20px] rounded-full hover:bg-[#e7e7e7] p-2 hover:text-[#0464e2]">
                                      <LuArrowBigDown />
                                    </div>
                                  </div>
                                  <div className="flex p-2 items-center cursor-pointer text-gray-500 hover:text-black hover:bg-[#e5ebee] rounded-full  ">
                                    <div className="pl-1">
                                      <FaRegComment className="" />
                                    </div>
                                    <p className="text-[12px] font-semibold px-2">
                                      Reply
                                    </p>
                                  </div>
                                  <div className="lg:flex md:flex p-2 hidden items-center cursor-pointer text-gray-500 hover:text-black hover:bg-[#e5ebee] rounded-full  ">
                                    <div className="px-1">
                                      <LiaAwardSolid className="text-lg" />
                                    </div>
                                    <p className="text-[12px] font-semibold px-2">
                                      Achieve
                                    </p>
                                  </div>
                                  <div className="flex items-center cursor-pointer text-gray-500 hover:text-black hover:bg-[#e5ebee] rounded-full  ">
                                    <div className="rounded-full py-2 pr-2 pl-3 ">
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
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            }
          </div>
        </div>
        <div className="lg:w-[280px] hidden lg:block mr-30">
          <UserPageRight />
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
