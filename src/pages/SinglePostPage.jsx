import React, { useContext, useEffect, useState } from "react";
import HomeSideBar from "../components/HomeSideBar";
import HomePageRight from "../components/HomePageRight";
import { AiOutlineMenu } from "react-icons/ai";
import { IoArrowUndoOutline, IoArrowRedoOutline } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa6";
import { LiaAwardSolid } from "react-icons/lia";
import { RiArrowLeftLine } from "react-icons/ri";
import { RiLoader4Fill } from "react-icons/ri";
import { TbLoader2 } from "react-icons/tb";
import { TbLoader3 } from "react-icons/tb";
import { LuArrowBigUp, LuArrowBigDown } from "react-icons/lu";
import { TbArrowBigUpFilled, TbArrowBigDownFilled } from "react-icons/tb";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RiLoader5Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import axios from "axios";
import { DataContext } from "../context/DataContext";
import ScrollToTop from "../components/ScrollToTop";

const SinglePostPage = () => {
  const { id } = useParams();
  const { user } = useContext(DataContext);
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [postCreator, setPostCreator] = useState(null);
  const [allComments, setAllComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commenting, setCommenting] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCommentArea, setIsCommentArea] = useState(false);
  const [commentData, setCommentData] = useState({
    user_id: user.id,
    post_id: id,
    user_name: user.username,
    text: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setCommentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!commentData.text) {
      toast.error("Cannot post empty comment, please input text", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      setCommenting(true);
      const resp = await axios.post(
        "http://localhost:5002/reddit/api/comment/create",
        commentData
      );
      if (resp.data.success) {
        setCommentData({
          user_id: user.id,
          post_id: id,
          user_name: user.username,
          text: "",
        });
        toast.success("Comment posted", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        getPostComments(id);
      } else {
        toast.error("Failed to post comment", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while posting comment",
        {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } finally {
      setCommenting(false);
    }
  };

  const getPostComments = async (id) => {
    try {
      const resp = await axios.get(
        `http://localhost:5002/reddit/api/posts/comments/${id}`
      );
      if (resp.data.success) {
        const commentsWithUsers = await Promise.all(
          resp.data.data.map(async (comment) => {
            try {
              const userResp = await axios.get(
                `http://localhost:5002/reddit/api/user/${comment.user_id}`
              );
              return {
                ...comment,
                userAvatar: userResp.data.success
                  ? userResp.data.data.avatar
                  : null,
              };
            } catch (error) {
              console.error("Error fetching user data:", error);
              return {
                ...comment,
                userAvatar: null,
              };
            }
          })
        );
        setAllComments(commentsWithUsers);
      }
    } catch (error) {
      console.error("Error fetching post comments:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getPostComments(id);
    }
  }, [id]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCommentArea = () => {
    setIsCommentArea(!isCommentArea);
  };

  const isLoggedIn = localStorage.getItem("reddit_user_id");

  function SignUpNow() {
    toast.info("Please login before proceeding with your action", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  useEffect(() => {
    const getSinglePost = async () => {
      try {
        setLoading(true);
        const resp = await axios.get(
          `http://localhost:5002/reddit/api/posts/${id}`
        );
        if (resp.data.success) {
          setPost(resp.data.data);
          try {
            setLoading(true);
            const response = await axios.get(
              `http://localhost:5002/reddit/api/user/${resp.data.data.user_id}`
            );
            if (response.data.success) {
              setPostCreator(response.data.data);
            }
          } catch (error) {
            setError("Failed to load post creator. Please try again later.");
            console.error("Error fetching post creator:", error);
          }
        }
      } catch (error) {
        setError("Failed to load post. Please try again later.");
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    getSinglePost();
  }, [id]);

  const handleVote = async (postId, action) => {
    const userId = localStorage.getItem("reddit_user_id");
    if (!userId) {
      toast.error("Please log in to vote");
      return;
    }

    setPost((prevPost) => {
      if (!prevPost) return prevPost;

      let newLikes = [...(prevPost.likes || [])];
      let newDislikes = [...(prevPost.dislikes || [])];

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
        ...prevPost,
        likes: newLikes,
        dislikes: newDislikes,
        score,
      };
    });

    try {
      const response = await axios.put(
        `http://localhost:5002/reddit/api/posts/${postId}/vote?action=${action}`,
        { userId }
      );

      if (!response.data.success) {
        const resp = await axios.get(
          `http://localhost:5002/reddit/api/posts/${id}`
        );
        if (resp.data.success) {
          setPost(resp.data.data);
        }
      }
    } catch (error) {
      console.error("Voting error:", error);
      const resp = await axios.get(
        `http://localhost:5002/reddit/api/posts/${id}`
      );
      if (resp.data.success) {
        setPost(resp.data.data);
      }
    }
  };

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

  if (!post && !loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Post not found
      </div>
    );

  return (
    <>
      <ScrollToTop/>
      <div className="flex max-w-full">
        <div className="hidden lg:block md:block ">
          {isSidebarOpen && (
            <div className="w-[220px]">
              <HomeSideBar />
            </div>
          )}
        </div>
        <div className="lg:w-[70%] lg:ml-[20px] md:ml-[10px] lg:mx-auto px-2 lg:px-7 md:px-5 mt-14 relative">
          <div className="border-gray-300 border-l-1 hidden lg:block md:block w-6 h-screen fixed">
            <div
              className="absolute top-5 left-[-15px] w-8 h-8 border-gray-600 border-1 rounded-full bg-white flex justify-center items-center cursor-pointer"
              onClick={toggleSidebar}
            >
              <AiOutlineMenu className="text-black" />
            </div>
          </div>
          <div className="lg:ml-10 md:ml-6">
            <div className="POST">
              {loading ? (
                <div className="flex justify-center items-center h-screen">
                  <div className="relative flex items-center justify-center">
                    <RiLoader4Fill className="text-[150px] animate-spin text-orange-500" />
                    <RiLoader5Fill className="absolute text-[60px] animate-spin text-orange-600" />
                    <TbLoader2 className="absolute text-[200px] animate-spin text-orange-300" />
                    <TbLoader3 className="absolute text-[40px] animate-spin text-orange-800" />
                  </div>
                </div>
              ) : (
                <div className="border-b-1 border-gray-300  py-2">
                  <div className="">
                    <div className="  py-2">
                      <div className=" px-3 py-1 ">
                        <div className="flex justify-between">
                          <div className="flex">
                            <div className="">
                              <div
                                onClick={() => navigate(-1)}
                                className="bg-gray-200 cursor-pointer mr-3 flex justify-centre items-centre text-black p-2 rounded-full"
                              >
                                <RiArrowLeftLine />
                              </div>
                            </div>
                            <div
                              onClick={() =>
                                navigate(`/user_profile/${post.user_id}`)
                              }
                              className="flex items-center"
                            >
                              <img
                                className="bg-gray-200 w-11 h-11 rounded-full"
                                src={
                                  postCreator?.avatar?.includes("uploads")
                                    ? `http://localhost:5002/${postCreator.avatar}`
                                    : postCreator?.avatar ||
                                      "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_7.png"
                                }
                                alt=""
                              />
                              <p className="text-[12px] font-semibold ml-2">
                                u/{post.user_name}
                              </p>
                            </div>
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
                        <div className="flex justify-between mt-2">
                          <div className="mb-3 w-full">
                            <h1 className="font-semibold text-gray-600 text-xl">
                              {post.title}
                            </h1>
                            <h1 className="my-2 text-gray-600 text-">
                              {post.text}
                            </h1>
                            {post.link && (
                              <Link to={post.link}>
                                <p className="text-sm text-blue-700 font-semibold hover:underline">
                                  {post.link}
                                </p>
                              </Link>
                            )}
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
                                            ? `http://localhost:5002/${post.image}`
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
                          <div
                            className={`flex items-center rounded-full text-gray-500 gap-1 ${
                              post.likes?.includes(
                                localStorage.getItem("reddit_user_id")
                              )
                                ? "bg-[#d93900] text-white"
                                : "text-gray-500 "
                            } ${
                              post.dislikes?.includes(
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
                                post.likes?.includes(
                                  localStorage.getItem("reddit_user_id")
                                )
                                  ? "hover:bg-[#00000025] text-white"
                                  : "text-gray-500 hover:bg-[#00000025]"
                              }`}
                            >
                              {post.likes?.includes(
                                localStorage.getItem("reddit_user_id")
                              ) ? (
                                <TbArrowBigUpFilled className="text-lg" />
                              ) : (
                                <LuArrowBigUp className="text-lg" />
                              )}
                            </button>

                            <span
                              className={`text-xs font-medium min-w-[20px] text-center ${
                                post.likes?.includes(
                                  localStorage.getItem("reddit_user_id")
                                ) ||
                                post.dislikes?.includes(
                                  localStorage.getItem("reddit_user_id")
                                )
                                  ? "text-[#ffffff]"
                                  : "text-gray-500"
                              }`}
                            >
                              {(post.likes?.length || 0) -
                                (post.dislikes?.length || 0)}
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVote(post._id, "dislike");
                              }}
                              className={`p-2 rounded-full bg-f ${
                                post.dislikes?.includes(
                                  localStorage.getItem("reddit_user_id")
                                )
                                  ? "hover:bg-[#00000025] text-white"
                                  : "text-gray-500 hover:bg-[#00000025]"
                              }`}
                            >
                              {post.dislikes?.includes(
                                localStorage.getItem("reddit_user_id")
                              ) ? (
                                <TbArrowBigDownFilled className="text-lg" />
                              ) : (
                                <LuArrowBigDown className="text-lg" />
                              )}
                            </button>
                          </div>
                          <div className="flex p-2 cursor-pointer items-center bg-[#e5ebee] rounded-full  ">
                            <div className="pl-1">
                              <FaRegComment className="text-black" />
                            </div>
                            <p className="text-[12px] font-semibold px-2">
                              {allComments.length}
                            </p>
                          </div>
                          <div className="flex p-2 items-center cursor-pointer bg-[#e5ebee] rounded-full  ">
                            <div className="px-1">
                              <LiaAwardSolid className="text-black text-lg" />
                            </div>
                          </div>
                          <div className="flex items-center cursor-pointer bg-[#e5ebee] rounded-full  ">
                            <div className="text-black  rounded-full py-2 pr-2 pl-3 ">
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
                </div>
              )}
              {isLoggedIn ? (
                isCommentArea ? (
                  <div className="py-2 w-full  border-1 border-gray-500 mt-5 rounded-2xl">
                    <textarea
                      className="outline-none w-full px-4 text-sm"
                      name="text"
                      onChange={handleInput}
                      value={commentData.text}
                      placeholder="What are your thoughts?"
                    ></textarea>
                    <div className="flex px-4 justify-between items-center">
                      <div className="text-gray-500">Aa</div>
                      <div className="flex gap-2">
                        <button
                          onClick={toggleCommentArea}
                          className="text-[12px] cursor-pointer bg-gray-200 text-black rounded-full py-2 px-3"
                        >
                          Cancel
                        </button>
                        {commenting ? (
                          <button className="text-[12px] cursor-pointer bg-blue-500 text-white rounded-full py-2 px-3">
                            Posting comment...
                          </button>
                        ) : (
                          <button
                            onClick={handleSubmit}
                            className="text-[12px] cursor-pointer bg-blue-700 text-white rounded-full py-2 px-3"
                          >
                            Comment
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    className="px-4 py-2 w-full cursor-text border-1 text-lg text-gray-500 text-left border-gray-300 mt-5 outline-none rounded-full"
                    onClick={toggleCommentArea}
                  >
                    Join the conversation
                  </button>
                )
              ) : (
                <button
                  className="px-4 py-2 w-full border-1 text-lg text-gray-500 text-left border-gray-300 mt-5 outline-none rounded-full"
                  onClick={SignUpNow}
                >
                  Join the conversation
                </button>
              )}
              {allComments.length === 0 ? (
                <div className="mt-10">
                  <div className="h-30 flex justify-center w-full">
                    <img
                      className=""
                      src="https://www.redditstatic.com/shreddit/assets/snoo_wave.png"
                      alt=""
                    />
                  </div>
                  <div className="text-center w-2/4 mx-auto mt-3 mb-10">
                    <h1 className="text-gray-700 font-semibold text-lg">
                      Be the first to comment
                    </h1>
                    <p className="text-[13px] mt-3">
                      Nobody's responded to this post yet. Add your thoughts and
                      get the conversation going.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  {allComments.map((comment) => (
                    <div key={comment._id} className="mb-6 ">
                      <div className="border-b-2 border-[#ebebeb11]">
                        <div
                          onClick={() =>
                            navigate(`/user_profile/${comment.user_id}`)
                          }
                          className="flex cursor-pointer items-center"
                        >
                          <img
                            className="bg-gray-200 w-8 h-8 rounded-full"
                            src={
                              comment.userAvatar
                                ? comment.userAvatar.includes("uploads")
                                  ? `http://localhost:5002/${comment.userAvatar}`
                                  : comment.userAvatar
                                : "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_7.png"
                            }
                            alt=""
                          />
                          <p className="text-[15px] font-semibold ml-2">
                            u/{comment.user_name}
                          </p>
                        </div>
                        <div className="mt-[-5px] md:ml-3.5 lg:ml-3.5 rounded-md ">
                          <p className="text-sm font-light px-2 py-3">
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
                            <div className="flex p-2 items-center cursor-pointer text-gray-500 hover:text-black hover:bg-[#e5ebee] rounded-full  ">
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
        </div>
        <div className="lg:w-[280px] hidden lg:block mr-30">
          <HomePageRight />
        </div>
      </div>
    </>
  );
};

export default SinglePostPage;
