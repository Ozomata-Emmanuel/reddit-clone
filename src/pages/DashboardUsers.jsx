import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiSearch, FiUser, FiMail, FiCalendar } from "react-icons/fi";
import { MdOutlineClose } from "react-icons/md";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiDeleteBinLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const DashboardUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userID, setUserID] = useState(null);
  const actionBarPostRef = useRef(null);
  const actionBarCommentRef = useRef(null);
  const [user, setUser] = useState(null);
  const [userStatus, setUserStatus] = useState();
  const [allComments, setAllComments] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [activePostId, setActivePostId] = useState(null);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");

  const updateStatus = async (e) => {
    e.preventDefault();

    if (!userStatus) {
      setError("Please select a status");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.put(
        `https://reddit-clone-backend-sdts.onrender.com/reddit/api/updateUser/status/${userID}`,
        { status: userStatus }
      );

      if (response.data.success) {
        setUser({ ...user, status: userStatus });
        setShowStatusModal(false);
        setUsers(
          users.map((u) =>
            u._id === userID ? { ...u, status: userStatus } : u
          )
        );
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        actionBarCommentRef.current &&
        !actionBarCommentRef.current.contains(event.target)
      ) {
        setActiveCommentId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const togglePostActionbar = (postId) => {
    setActivePostId(activePostId === postId ? null : postId);
  };

  const toggleCommentActionbar = (commentId) => {
    setActiveCommentId(activeCommentId === commentId ? null : commentId);
  };

  const handleUserClick = async (id) => {
    try {
      setModalLoading(true);
      setError(null);
      setShowUserModal(true);
      setUserID(id);
      await Promise.all([getUser(id), getUserPosts(id), getUserComments(id)]);
    } catch (error) {
      console.error("Error loading user data:", error);
      setError("Failed to load user data. Please try again.");
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `https://reddit-clone-backend-sdts.onrender.com/reddit/api/users/all`
        );
        if (response.data.success) {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getUser = async (id) => {
    try {
      const resp = await axios.get(
        `https://reddit-clone-backend-sdts.onrender.com/reddit/api/user/${id}`
      );
      if (resp.data.success) {
        setUser(resp.data.data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  };

  const getUserComments = async (id) => {
    try {
      const resp = await axios.get(
        `https://reddit-clone-backend-sdts.onrender.com/reddit/api/user/comment/${id}`
      );
      if (resp.data.success) {
        setAllComments(resp.data.data);
      }
    } catch (error) {
      console.error("Error fetching user comments:", error);
      throw error;
    }
  };

  const getUserPosts = async (id) => {
    try {
      const resp = await axios.get(
        `https://reddit-clone-backend-sdts.onrender.com/reddit/api/posts/user/${id}`
      );
      if (resp.data.success) {
        setUserPosts(resp.data.data);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
      throw error;
    }
  };

  const deletePost = async (postId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmed) {
      try {
        const resp = await axios.delete(
          `https://reddit-clone-backend-sdts.onrender.com/reddit/api/posts/delete/${postId}`
        );
        if (resp.data.success) {
          setUserPosts(userPosts.filter((post) => post._id !== postId));
          toast.success("Post deleted successfully", {
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
        toast.error(error?.response?.data?.message || "Error deleting post", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      setActivePostId(null);
    } else {
      return;
    }
  };

  const deleteComment = async (commentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (confirmed) {
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
        toast.error(error?.response?.data?.message || "Error deleting comment", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      setActiveCommentId(null);
    } else {
      return;
    }
  };

  const deleteUser = async (userID) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmed) {
      try {
        const resp = await axios.delete(
          `https://reddit-clone-backend-sdts.onrender.com/reddit/api/deleteUser/${userID}`
        );
        if (resp.data.success) {
          setUsers(users.filter((user) => user._id !== userID));
          toast.success("User deleted successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setShowUserModal(false);
          setShowStatusModal(false);
          setUserID(null);
          setUser(null);
          setAllComments([]);
          setUserPosts([]);
          setError(null);
        } else {
          toast.error("Failed to delete user", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } catch (error) {
        console.error("Error deleting user", error);
        toast.error(error?.response?.data?.message || "Error deleting user", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      setActivePostId(null);
    } else {
      return;
    }
  };

  const handleCloseModal = () => {
    setShowUserModal(false);
    setShowStatusModal(false);
    setUserID(null);
    setUser(null);
    setAllComments([]);
    setUserPosts([]);
    setError(null);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          User Management
        </h1>
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center">
                    <FiUser className="mr-2" />
                    Username
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center">
                    <FiMail className="mr-2" />
                    Email
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center">
                    <FiCalendar className="mr-2" />
                    Joined
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user._id}
                    onClick={() => handleUserClick(user._id)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <FiUser className="text-orange-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(user.date_registered)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.status === "disabled" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          {user.status}
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {user.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-orange-600 hover:text-orange-900 mr-4">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showUserModal && userID && (
          <div className="h-screen w-full bg-[#0602169c] fixed flex items-center justify-center z-50 top-0 left-0">
            <div className="bg-white w-3/4 flex p-5 rounded-2xl h-[80vh] relative">
              <div
                onClick={handleCloseModal}
                className="bg-[#00000021] cursor-pointer w-11 h-11 rounded-full flex justify-center items-center absolute right-10"
              >
                <MdOutlineClose />
              </div>

              {modalLoading ? (
                <div className="flex justify-center items-center w-full h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              ) : user ? (
                <>
                  <div className="w-1/3 border-r border-gray-300 pr-5 flex flex-col">
                    <div className="flex items-center mb-6">
                      <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <FiUser className="text-orange-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-lg font-medium text-gray-900">
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <button onClick={() => deleteUser(user.id)} className="text-md bg-red-600 text-white rounded-2xl px-3 py-1">
                        delete User
                      </button>
                    </div>

                    <div className="flex space-x-2 mb-2">
                      <button
                        onClick={() => setActiveTab("posts")}
                        className={`px-4 py-2 ${
                          activeTab === "posts"
                            ? "bg-orange-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        } rounded-md hover:bg-orange-600 transition`}
                      >
                        Posts ({userPosts.length})
                      </button>
                      <button
                        onClick={() => setActiveTab("comments")}
                        className={`px-4 py-2 ${
                          activeTab === "comments"
                            ? "bg-orange-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        } rounded-md hover:bg-orange-600 transition`}
                      >
                        Comments ({allComments.length})
                      </button>
                    </div>
                    <div className="mb-2">
                      <select
                        className="w-full border-gray-300 border-2 appearance-none p-2 outline-none rounded-xl shadow"
                        value={user?.status || ""}
                        onChange={(e) => {
                          setUserStatus(e.target.value);
                          setShowStatusModal(true);
                        }}
                      >
                        <option value="">Select Status</option>
                        <option value="active">active</option>
                        <option value="disabled">disabled</option>
                      </select>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      <h3 className="font-medium mb-3">Recent Activity</h3>
                      {activeTab === "posts"
                        ? userPosts.slice(0, 5).map((post) => (
                            <div
                              key={post._id}
                              className="p-3 bg-gray-50 rounded-md mb-2"
                            >
                              <div className="text-sm text-gray-500">
                                Posted "{post.title}"
                              </div>
                              <div className="text-xs text-gray-400">
                                {formatDate(post.createdAt)}
                              </div>
                            </div>
                          ))
                        : allComments.slice(0, 5).map((comment) => (
                            <div
                              key={comment._id}
                              className="p-3 bg-gray-50 rounded-md mb-2"
                            >
                              <div className="text-sm text-gray-500">
                                Commented on post
                              </div>
                              <div className="text-xs text-gray-400">
                                {formatDate(comment.createdAt)}
                              </div>
                            </div>
                          ))}
                    </div>
                  </div>

                  <div className="w-2/3 pl-5 overflow-y-auto">
                    <h2 className="text-xl font-bold mb-5">
                      {activeTab === "posts" ? "User Posts" : "User Comments"}
                    </h2>

                    {activeTab === "posts" ? (
                      userPosts.length > 0 ? (
                        <div className="space-y-4">
                          {userPosts.map((post) => (
                            <div
                              key={post._id}
                              className="relative border-b border-gray-200 pb-4"
                            >
                              <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg mb-2">
                                  {post.title || "Untitled Post"}
                                </h3>
                                <div
                                  onClick={() => togglePostActionbar(post._id)}
                                  className="rounded-full mr-4 hover:bg-gray-100 duration-200 h-9 w-9 flex justify-center items-center cursor-pointer"
                                >
                                  <HiOutlineDotsHorizontal />
                                </div>
                              </div>
                              {activePostId === post._id && (
                                <div
                                  ref={actionBarPostRef}
                                  className="w-40 bg-white border border-gray-300 shadow-lg rounded-lg absolute right-0 top-8 z-10"
                                >
                                  <div
                                    onClick={() => deletePost(post._id)}
                                    className="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100 text-sm font-semibold rounded-b-lg"
                                  >
                                    <RiDeleteBinLine className="text-[16px]" />
                                    Delete
                                  </div>
                                </div>
                              )}
                              <p className="text-gray-700 mb-3">
                                {post.text
                                  ? `${post.text.substring(0, 150)}...`
                                  : ""}
                              </p>
                              <Link to={post.link}>
                                <p className="text-blue-700 font-semibold mb-3">
                                  {post.link
                                    ? `${post.link.substring(0, 150)}...`
                                    : ""}
                                </p>
                              </Link>
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
                              <div className="flex justify-between text-sm text-gray-500">
                                <span>
                                  Posted: {formatDate(post.createdAt)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No posts found</p>
                      )
                    ) : allComments.length > 0 ? (
                      <div className="space-y-4">
                        {allComments.map((comment) => (
                          <div
                            key={comment._id}
                            className="border-b relative border-gray-200 pb-4"
                          >
                            <div className="flex justify-between items-center">
                              <p className="text-gray-700 mb-3">
                                {comment.text}
                              </p>
                              <div
                                onClick={() =>
                                  toggleCommentActionbar(comment._id)
                                }
                                className="rounded-full mr-4 hover:bg-gray-100 duration-200 h-9 w-9 flex justify-center items-center cursor-pointer"
                              >
                                <HiOutlineDotsHorizontal />
                              </div>
                            </div>
                            {activeCommentId === comment._id && (
                              <div
                                ref={actionBarCommentRef}
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
                            <div className="flex justify-between text-sm text-gray-500">
                              <span>
                                Commented: {formatDate(comment.createdAt)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No comments found</p>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full text-center py-10 text-gray-500">
                  User data not available
                </div>
              )}
            </div>
            {showStatusModal && (
              <div className="fixed inset-0 bg-[#0001149c] flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-96">
                  <h3 className="text-lg font-medium mb-4">
                    Confirm Status Update
                  </h3>
                  <p className="mb-4">
                    Are you sure you want to change the user's status to{" "}
                    <span className="font-semibold text-red-600">
                      {userStatus}
                    </span>
                    ?
                  </p>

                  {error && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowStatusModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={updateStatus}
                      disabled={loading}
                      className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
                    >
                      {loading ? "Updating..." : "Confirm"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardUsers;
