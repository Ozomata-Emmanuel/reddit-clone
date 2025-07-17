import React, { useContext, useState } from "react";
import HomeSideBar from "../components/HomeSideBar";
import { MdOutlineKeyboardArrowRight, MdClose } from "react-icons/md";
import { AiOutlineMenu } from "react-icons/ai";
import { DataContext } from "../context/DataContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UserSettings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, setUser } = useContext(DataContext);
  const { id } = useParams();
  const [usernameModal, setUsernameModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [genderModal, setGenderModal] = useState(false);
  const [avatarModal, setAvatarModal] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState(user.gender || "");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateUsername = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Username cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/reddit/api/updateUser/username/${id}`,
        {
          username,
        }
      );
      if (response.data.success) {
        setUser({ ...user, username });
        setUsernameModal(false);
        toast.success("Username updated successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update userame");
      toast.error("Failed to update username", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/reddit/api/updateUser/password/${id}`,
        {
          currentPassword,
          newPassword,
        }
      );

      if (response.data.success) {
        setPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast.success("Password updated successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
      toast.error("Failed to update password", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const updateGender = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/reddit/api/updateUser/gender/${id}`,
        {
          gender,
        }
      );
      if (response.data.success) {
        setUser({ ...user, gender });
        toast.success("Gender updated successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setGenderModal(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update gender");
      toast.error("Failed to update gender", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const updateAvatar = async () => {
    if (!avatar) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("avatar", avatar);

      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/reddit/api/updateUser/avatar/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setUser({ ...user, avatar: response.data.avatarUrl });
        setAvatarModal(false);
        toast.success("Avatar updated successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update avatar");
      toast.error(error.response?.data?.message || "Failed to update avatar", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const closeModal = () => {
    setUsernameModal(false);
    setPasswordModal(false);
    setGenderModal(false);
    setAvatarModal(false);
    setError("");
    setUsername(user.username);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setGender(user.gender || "");
    setAvatar(null);
    setAvatarPreview(user.avatar || "");
  };

  return (
    <>
      <div className="flex max-w-full">
        <div className="hidden lg:block md:block ">
          {isSidebarOpen && (
            <div className="w-[220px]">
              <HomeSideBar />
            </div>
          )}
        </div>
        <div className="lg:w-[100%] w-full  lg:ml-[10px] md:ml-[10px] lg:mx-auto lg:px-7 md:px-5 mt-14 relative">
          <div className="border-gray-300 border-l-1 hidden lg:block md:block w-6 h-screen fixed">
            <div
              className="absolute top-5 left-[-15px] w-8 h-8 border-gray-600 border-1 rounded-full bg-white flex justify-center items-center cursor-pointer"
              onClick={toggleSidebar}
            >
              <AiOutlineMenu className="text-black" />
            </div>
          </div>
          <div className="lg:ml-10 md:ml-6 sm:ml-0 mx-2">
            <div className="pt-7">
              <h1 className="font-bold text-gray-800 text-[33px]">Settings</h1>
            </div>
            <div className="flex items-center gap-2 mb-3 mt-4">
              <div className="text-[14px] cursor-pointer text-black font-semibold py-2 px-4 border-b-2 border-b-gray-800">
                Account
              </div>
              <div className="text-[14px] cursor-pointer text-gray-600 font-semibold py-2 px-4 border-b-2 border-white duration-200 hover:border-b-gray-800">
                Profile
              </div>
              <div className="text-[14px] hidden lg:block md:block cursor-pointer text-gray-600 font-semibold py-2 px-4 border-b-2 border-white duration-200 hover:border-b-gray-800">
                Privacy
              </div>
              <div className="text-[14px] hidden lg:block md:block cursor-pointer text-gray-600 font-semibold py-2 px-4 border-b-2 border-white duration-200 hover:border-b-gray-800">
                Preferences
              </div>
              <div className="text-[14px] cursor-pointer text-gray-600 font-semibold py-2 px-4 border-b-2 border-white duration-200 hover:border-b-gray-800">
                Notifications
              </div>
              <div className="text-[14px] cursor-pointer text-gray-600 font-semibold py-2 px-4 border-b-2 border-white duration-200 hover:border-b-gray-800">
                Email
              </div>
            </div>
            <div className="">
              <h2 className="text-xl font-bold text-gray-800 mb-3">General</h2>
              <div className="grid w-full grid-cols-1 gap-4">
                <div
                  className="flex items-center justify-between  px-2 py-1 rounded-lg hover:bg-gray-300 cursor-pointer"
                  onClick={() => setUsernameModal(true)}
                >
                  <div className="">
                    <p className="text-[15px]">Username</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-[13px]">{user.username}</p>
                    <div className="hover:bg-gray-400 cursor-pointer rounded-full h-10 w-10 flex items-center justify-center">
                      <MdOutlineKeyboardArrowRight className="text-2xl" />
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center justify-between  px-2 py-1 rounded-lg hover:bg-gray-300 cursor-pointer"
                  onClick={() => setPasswordModal(true)}
                >
                  <div className="">
                    <p className="text-[15px]">Password</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-[13px]">••••••••</p>
                    <div className="hover:bg-gray-400 cursor-pointer rounded-full h-10 w-10 flex items-center justify-center">
                      <MdOutlineKeyboardArrowRight className="text-2xl" />
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center justify-between  px-2 py-1 rounded-lg hover:bg-gray-300 cursor-pointer"
                  onClick={() => setGenderModal(true)}
                >
                  <div className="">
                    <p className="text-[15px]">Gender</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-[13px]">
                      {user.gender || "Not specified"}
                    </p>
                    <div className="hover:bg-gray-400 cursor-pointer rounded-full h-10 w-10 flex items-center justify-center">
                      <MdOutlineKeyboardArrowRight className="text-2xl" />
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center justify-between  px-2 py-1 rounded-lg hover:bg-gray-300 cursor-pointer"
                  onClick={() => setAvatarModal(true)}
                >
                  <div className="">
                    <p className="text-[15px]">Avatar</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full w-8 h-8">
                      <img
                        className="rounded-full w-full h-full object-cover"
                        src={
                          user?.avatar?.includes("uploads")
                            ? `${process.env.REACT_APP_API_BASE_URL}/${user.avatar}`
                            : user.avatar
                        }
                        alt="Avatar"
                      />
                    </div>
                    <div className="hover:bg-gray-400 cursor-pointer rounded-full h-10 w-10 flex items-center justify-center">
                      <MdOutlineKeyboardArrowRight className="text-2xl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {usernameModal && (
        <div className="fixed inset-0 bg-[#00040f91] backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-3 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-700">
                Change Username
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-300"
              >
                <MdClose className="text-2xl" />
              </button>
            </div>
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Username
              </label>
              <input
                type="text"
                value={username}
                placeholder="Name"
                maxLength={20}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-4 rounded-3xl focus:outline-none bg-gray-200 focus:ring-2 focus:ring-blue-500"
              />
              <div className="w-full flex justify-end">
                <p className="text-sm text-gray-500 mr-4 mt-3">
                  {20 - username?.length}
                </p>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 cursor-pointer text-[14px] font-semibold rounded-full hover:bg-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={updateUsername}
                className="px-4 py-2 bg-blue-800 cursor-pointer text-[14px] font-semibold text-white rounded-full hover:bg-blue-900 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {passwordModal && (
        <div className="fixed inset-0 bg-[#00040f91] backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-3 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-700">
                Change Password
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-300"
              >
                <MdClose className="text-2xl" />
              </button>
            </div>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-5 py-4 rounded-3xl focus:outline-none bg-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-5 py-4 rounded-3xl focus:outline-none bg-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-5 py-4 rounded-3xl focus:outline-none bg-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 cursor-pointer text-[14px] font-semibold rounded-full hover:bg-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={updatePassword}
                className="px-4 py-2 bg-blue-800 cursor-pointer text-[14px] font-semibold text-white rounded-full hover:bg-blue-900 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {genderModal && (
        <div className="fixed inset-0 bg-[#00040f91] backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-3 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-700">Change Gender</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-300"
              >
                <MdClose className="text-2xl" />
              </button>
            </div>
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-5 py-4 rounded-3xl focus:outline-none bg-gray-200 focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 cursor-pointer text-[14px] font-semibold rounded-full hover:bg-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={updateGender}
                className="px-4 py-2 bg-blue-800 cursor-pointer text-[14px] font-semibold text-white rounded-full hover:bg-blue-900 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {avatarModal && (
        <div className="fixed inset-0 bg-[#00040f91] backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-3 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-700">Change Avatar</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-300"
              >
                <MdClose className="text-2xl" />
              </button>
            </div>
            <div className="mb-8">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-2 border-gray-200">
                  {avatarPreview.length === user.avatar.length ? (
                    <img
                      src={
                        user?.avatar?.includes("uploads")
                          ? `${process.env.REACT_APP_API_BASE_URL}/${user.avatar}`
                          : user.avatar
                      }
                      alt="Avatar Current"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <label className="cursor-pointer bg-gray-200 px-6 py-2 rounded-full hover:bg-blue-900 text-[13px] font-semibold">
                  Select a new image
                  <input
                    type="file"
                    name="avatar"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-3">
                  Supports JPG, PNG, WEBP
                </p>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 cursor-pointer text-[14px] font-semibold rounded-full hover:bg-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={updateAvatar}
                className="px-4 py-2 bg-blue-800 cursor-pointer text-[14px] font-semibold text-white rounded-full hover:bg-blue-900 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserSettings;
