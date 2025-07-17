import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { IoCloseOutline } from "react-icons/io5";
import { IoAddOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineMessage } from "react-icons/ai";
import { RiAdvertisementLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import { LiaUserEditSolid } from "react-icons/lia";
import { IoTrophyOutline } from "react-icons/io5";
import { TbShieldCheckered } from "react-icons/tb";
import { IoLogOutOutline } from "react-icons/io5";
import { MdOutlineAdsClick } from "react-icons/md";
import { LuChartNoAxesColumnIncreasing } from "react-icons/lu";
import { SlSettings } from "react-icons/sl";
import { CiWallet } from "react-icons/ci";
import { FiMenu } from "react-icons/fi";
import HomeSideBar from "./HomeSideBar";

const NavigationBar = () => {
  const { user, setUser, getUser } = useContext(DataContext);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [showUserModal, setShowUserModal] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [signUpData, setSignUpData] = useState({
    email: "",
    username: "",
    password: "",
    gender: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);
  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      setIsLoginView(true);
    }
  };
  const toggleProfileModal = () => {
    setShowUserModal(!showUserModal);
  };
  const toggleSideBar = () => {
    setShowSideBar(!showSideBar);
  };
  const switchToSignup = () => {
    setIsLoginView(false);
  };
  const switchToLogin = () => {
    setIsLoginView(true);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!signUpData.email || !signUpData.username || !signUpData.password || !signUpData.gender) {
      toast.error("Please fill in all fields", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const resp = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/reddit/api/users/register`,
        signUpData
      );
      if (resp.data.success) {
        toast.success("User registration successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setShowModal(true);
        setIsLoginView(true);
      } else {
        toast.error(resp.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
      setSignUpData({
        email: "",
        username: "",
        password: "",
        gender: "",
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields", {
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
      setLoading(true);
      const resp = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/reddit/api/users/login`,
        loginData
      );
      if (resp.data.success) {
        if(resp.data.data.role === "admin") {
          localStorage.setItem("reddit_user_id", resp.data.data.id);
          setUser(resp.data.data);
          navigate("/dashboard/overview")
          toast.success("Admin logged in successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          window.location.reload()
          isLoggedIn
        }
        if(resp.data.data.role === "user" && resp.data.data.status === "active"){
          localStorage.setItem("reddit_user_id", resp.data.data.id);
          setUser(resp.data.data);
          toast.success("User Logged in successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          window.location.reload()
          isLoggedIn
        }
        if(resp.data.data.status === "disabled"){
          toast.warning("Your account has been disabled please contact us for more information", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          return
        }
        setShowModal(false);
        setLoginData({
          email: "",
          password: "",
        });
      } else {
        toast.error(resp?.data?.message || "An error occured while logging in", {
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
      toast.error(error?.response?.data?.message || "An error occured while logging in", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      isLoggedIn
      getUser()
      setLoading(false);
    }
  };

  function logout() {
    localStorage.removeItem("reddit_user_id");
    setUser(null)
    navigate("/")
    toast.info("Logged out successfully", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    isLoggedIn;
  }

  const isLoggedIn = localStorage.getItem("reddit_user_id");

  return (
    <>
      <nav className="bg-white fixed z-40 w-full flex justify-between h-14 items-center border-b-1 px-3 border-gray-300">
        <div>
          <div className="flex w-27 items-center">
            <div onClick={toggleSideBar} className="flex w-10 h-10 md:hidden lg:hidden rounded-full mr-2 hover:bg-gray-100 transition-colors duration-150 items-center justify-center">
              <FiMenu className=""/>
            </div>
            {
              showSideBar ? (
                <div className="w-full flex md:hidden lg:hidden top-14 h-[250%] fixed z-30 left-0">
                  <div onClick={toggleSideBar} className="bg-[#0000009c] h-full w-full"></div>
                  <HomeSideBar/>  
                </div>
              ) : (
                <div className=""></div>
              )
            }
            <Link className="flex items-center" to="/">
              <img
                className="w-[35px] h-[35px]"
                src="https://img.icons8.com/?size=100&id=lIDbCMF329KK&format=png&color=ff4500"
                alt=""
              />
              <h1 className="text-[#ff4500] hidden lg:block md:block ml-2 text-[30px] font-bold">
                reddit
              </h1>
            </Link>
          </div>
        </div>
        <div className="hidden lg:block md:block relative">
          <img
            className="absolute w-[18px] h-[18px] top-[12px] left-[17px]"
            src="https://img.icons8.com/?size=100&id=McUzNetNtaJK&format=png&color=000000"
            alt=""
          />
          <input
            type="text"
            placeholder="Search Reddit"
            className="lg:w-140 md:w-70 hover:bg-[#d4dadd] outline-blue-400 focus:bg-white focus:hover:bg-[#e5ebee] bg-[#e5ebee] placeholder:text-sm rounded-full h-10 pl-11"
          />
        </div>
        {isLoggedIn ? (
          <div className="flex justify-end lg:w-67 md:w-60 w-55 items-center relative">
            <div className="flex  items-center ">
              <div className="flex justify-center items-center transition duration-200 cursor-pointer hover:bg-[#e5ebee] p-1.5 lg:p-2 sm:p-1 rounded-full">
                <RiAdvertisementLine className="lg:text-2xl hidden lg:block md:block md:text-xl text-lg font-light" />
              </div>
              <div className="flex justify-center items-center transition duration-200 cursor-pointer hover:bg-[#e5ebee] p-1.5 lg:p-2 sm:p-1 rounded-full">
                <AiOutlineMessage className="lg:text-2xl md:text-xl text-lg" />
              </div>
              <Link to="/create_post">
                <div className="flex items-center transition duration-200 bg-white cursor-pointer  hover:bg-[#e5ebee] rounded-full h-10 px-3">
                  <IoAddOutline className="lg:text-2xl md:text-xl text-lg" />
                  <h4 className="font-[500] text-[14px] mx-2">Create</h4>
                </div>
              </Link>
              <div className="flex justify-center items-center transition duration-200 cursor-pointer hover:bg-[#e5ebee] p-1.5 lg:p-2 sm:p-1 rounded-full">
                <IoMdNotificationsOutline className="lg:text-2xl md:text-xl text-lg" />
              </div>
            </div>
            <div onClick={toggleProfileModal} className="cursor-pointer right-0 rounded-full flex items-center border-4 md:hover:border-[#cbdcec] lg:hover:border-[#cbdcec] border-[#ffffff] transition duration-200">
              <div className="h-8 w-8">
                <img
                  className="rounded-full h-8 w-8"
                  src={user?.avatar?.includes('uploads') ? `${import.meta.env.VITE_API_BASE_URL}/${user.avatar}` : user.avatar}
                  alt=""
                />
                <div className="relative">
                  <div className="absolute w-2 h-2 bg-green-500 rounded-full bottom-0 right-0.5"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-between w-57">
            <div className="flex items-center bg-[#e5ebee] rounded-full h-10 px-3">
              <img
                className="w-[25px] h-[25px] "
                src="https://img.icons8.com/?size=100&id=WVSnTitkTCYf&format=png&color=000000"
                alt=""
              />
              <h4 className="font-[500] text-[14px] ml-2">Get App</h4>
            </div>
            <div
              className="bg-[#d93900] items-center flex h-10 px-3 rounded-full cursor-pointer"
              onClick={toggleModal}
            >
              <h4 className="text-white font-[500] text-[14px]">Log In</h4>
            </div>
            <div className="h-10 w-10 rounded-full flex items-center hover:bg-[#e5ebee] transition duration-200 px-3">
              <img
                className=""
                src="https://img.icons8.com/?size=100&id=61873&format=png&color=000000"
                alt=""
              />
            </div>
          </div>
        )}
      </nav>

      {showModal && (
        <div className="fixed inset-0 bg-[#060a117e]  flex justify-center items-center z-40">
          <div className="bg-white z-50 rounded-2xl h-[630px] w-[520px] p-6">
            <div className="flex justify-end">
              <button
                onClick={toggleModal}
                className="text-gray-700 cursor-pointer text-2xl rounded-full p-1 bg-gray-200 hover:bg-gray-300"
              >
                <IoCloseOutline />
              </button>
            </div>

            {isLoginView ? (
              <div className="px-12">
                <div className="text-center text-[#181c1f]">
                  <h2 className="text-2xl font-bold mb-2 mt-2">Log in</h2>
                  <p className="text-sm text-[#414a4f] mb-4">
                    By continuing, you agree to our{" "}
                    <span className="text-blue-500 cursor-pointer hover:underline">
                      User Agreement
                    </span>{" "}
                    and acknowledge that you understand the{" "}
                    <span className="text-blue-500 cursor-pointer hover:underline">
                      Privacy Policy
                    </span>
                    .
                  </p>
                </div>

                <div className="space-y-2">
                  <button className="w-full bg-white relative border border-gray-300 rounded-full py-[10px] flex items-center justify-center">
                    <img
                      src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
                      alt=""
                      className="absolute left-2 h-[20px] w-[20px]"
                    />
                    <span className="ml-2 font-semibold text-[#212121] text-sm">
                      Continue with Google
                    </span>
                  </button>
                  <button className="w-full bg-white relative border border-gray-300 rounded-full py-[10px] flex items-center justify-center">
                    <img
                      src="https://img.icons8.com/?size=100&id=95294&format=png&color=000000"
                      alt=""
                      className="absolute left-2 h-[20px] w-[20px]"
                    />
                    <span className="ml-2 font-semibold text-[#212121] text-sm">
                      Continue with Apple
                    </span>
                  </button>

                  <div className="relative flex justify-center items-center my-4 border-b-2 border-[#ebebeb]">
                    <span className="fle px-[10px] mb-[-9px] bg-white text-[#5c6c74] text-xs">
                      OR
                    </span>
                  </div>

                  <input
                    type="text"
                    placeholder="Email or username *"
                    value={loginData.email}
                    onChange={handleInput}
                    name="email"
                    className="w-full focus:outline-2 outline-0 outline-blue-500 bg-[#e5ebee] placeholder:text-[16px] rounded-3xl px-4 py-5 text-sm"
                  />
                  <input
                    type="password"
                    placeholder="Password *"
                    value={loginData.password}
                    onChange={handleInput}
                    name="password"
                    className="w-full focus:outline-2 outline-0 outline-blue-500 bg-[#e5ebee] placeholder:text-[16px] rounded-3xl px-4 py-5 text-sm"
                  />

                  <p className="text-sm mb-3 text-blue-500 cursor-pointer hover:underline">
                    Forgot password?
                  </p>

                  <p className="text-sm mb-15 text-[#5f5f5f]">
                    New to Reddit?{" "}
                    <button
                      onClick={switchToSignup}
                      className="text-blue-500 cursor-pointer hover:underline"
                    >
                      Sign Up
                    </button>
                  </p>
                  {loading ? (
                    <button className="w-full cursor-not-allowed  bg-[#d93a00b4] text-white rounded-full py-2 text-md font-semibold">
                      Loging in...
                    </button>
                  ) : (
                    <button
                      onClick={handleLogin}
                      className="w-full cursor-pointer bg-[#d93900] text-white rounded-full py-2 text-md font-semibold"
                    >
                      Log In
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="px-12">
                <div className="text-center text-[#181c1f]">
                  <h2 className="text-2xl font-bold mb-2 mt-2">Sign Up</h2>
                  <p className="text-sm text-[#414a4f] mb-4">
                    By continuing, you agree to our{" "}
                    <span className="text-blue-500 cursor-pointer hover:underline">
                      User Agreement
                    </span>{" "}
                    and acknowledge that you understand the{" "}
                    <span className="text-blue-500 cursor-pointer hover:underline">
                      Privacy Policy
                    </span>
                    .
                  </p>
                </div>

                <div className="space-y-2">
                  <button className="w-full bg-white relative border border-gray-300 rounded-full py-[10px] flex items-center justify-center">
                    <img
                      src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
                      alt=""
                      className="absolute left-2 h-[20px] w-[20px]"
                    />
                    <span className="ml-2 font-semibold text-[#212121] text-sm">
                      Continue with Google
                    </span>
                  </button>
                  <button className="w-full bg-white relative border border-gray-300 rounded-full py-[10px] flex items-center justify-center">
                    <img
                      src="https://img.icons8.com/?size=100&id=95294&format=png&color=000000"
                      alt=""
                      className="absolute left-2 h-[20px] w-[20px]"
                    />
                    <span className="ml-2 font-semibold text-[#212121] text-sm">
                      Continue with Apple
                    </span>
                  </button>

                  <div className="relative flex justify-center items-center my-4 border-b-2 border-[#ebebeb]">
                    <span className="fle px-[10px] mb-[-9px] bg-white text-[#5c6c74] text-xs">
                      OR
                    </span>
                  </div>

                  <input
                    type="text"
                    placeholder="Email *"
                    value={signUpData.email}
                    onChange={handleInput}
                    name="email"
                    className="w-full focus:outline-2 outline-0 outline-blue-500 bg-[#e5ebee] placeholder:text-[16px] rounded-3xl px-4 py-4 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Username *"
                    value={signUpData.username}
                    onChange={handleInput}
                    name="username"
                    className="w-full focus:outline-2 outline-0 outline-blue-500 bg-[#e5ebee] placeholder:text-[16px] rounded-3xl px-4 py-4 text-sm"
                  />
                  <input
                    type="password"
                    placeholder="Password *"
                    value={signUpData.password}
                    onChange={handleInput}
                    name="password"
                    className="w-full focus:outline-2 outline-0 outline-blue-500 bg-[#e5ebee] placeholder:text-[16px] rounded-3xl px-4 py-4 text-sm"
                  />
                  <select
                    name="gender"
                    value={signUpData.gender}
                    onChange={handleInput}
                    className="w-full focus:outline-2 outline-0 outline-blue-500 bg-[#e5ebee] placeholder:text-[16px] rounded-3xl px-4 py-4 text-sm appearance-none"
                  >
                    <option value="">Select your gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>

                  <p className="text-sm mb-5 text-[#5f5f5f]">
                    Already a redditor?{" "}
                    <button
                      onClick={switchToLogin}
                      className="text-blue-500 cursor-pointer hover:underline"
                    >
                      Log In
                    </button>
                  </p>
                  {loading ? (
                    <button className="w-full cursor-not-allowed  bg-[#d93a00b4] text-white rounded-full py-2 text-md font-semibold">
                      Signing Up...
                    </button>
                  ) : (
                    <button
                      onClick={handleSignUp}
                      className="w-full cursor-pointer bg-[#d93900] text-white rounded-full py-2 text-md font-semibold"
                    >
                      Sign Up
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showUserModal && (
        <div onClick={toggleProfileModal}  className="fixed inset-0 bg-[#00000015] flex justify-end z-40">
          <div className=" z-50 w-[270px] mt-14 mr-2 ">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
              <Link to={`/user_profile/${user.id}`}>
                <div className="w-full flex px-4 py-2 hover:bg-gray-100 cursor-pointer items-center">
                  <div className="rounded-full relative w-8 h-8">
                    <img
                      className="rounded-full"
                      src={user?.avatar?.includes('uploads') ? `${import.meta.env.VITE_API_BASE_URL}/${user.avatar}` : user.avatar}
                      alt=""
                    />
                    <div className="relative">
                      <div className="absolute w-2 h-2 bg-green-500 rounded-full bottom-0 right-0.5"></div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h1 className="text-[#333d42] text-sm">View profile</h1>
                    <p className="text-sm text-gray-400">u/{user.username}</p>
                  </div>
                </div>
              </Link>
              <Link to={`/settings/${user.id}`}>
                <div className="w-full flex px-4 py-2 hover:bg-gray-100 cursor-pointer items-center">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <LiaUserEditSolid className="text-2xl" />
                  </div>
                  <div className="ml-4">
                    <h1 className="text-[#333d42] text-sm">Edit Avatar</h1>
                  </div>
                </div>
              </Link>
              <div className="w-full flex px-4 py-2 hover:bg-gray-100 cursor-pointer items-center">
                <div className="w-10 h-10 flex items-center justify-center">
                  <TbShieldCheckered className="text-2xl" />
                </div>
                <div className="ml-4">
                  <h1 className="text-[#333d42] text-sm">Premium</h1>
                </div>
              </div>
              <div className="w-full flex px-4 py-2 hover:bg-gray-100 cursor-pointer items-center">
                <div className="w-10 h-10 flex items-center justify-center">
                  <TbShieldCheckered className="text-2xl" />
                </div>
                <div className="ml-4">
                  <h1 className="text-[#333d42] text-sm">Dark Mode</h1>
                </div>
              </div>
              <div
                onClick={logout}
                className="w-full border-b-1 border-gray-300 flex px-4 py-2 hover:bg-gray-100 cursor-pointer items-center"
              >
                <div className="w-10 h-10 flex items-center justify-center">
                  <IoLogOutOutline className="text-2xl" />
                </div>
                <div className="ml-4">
                  <h1 className="text-[#333d42] text-sm">Log Out</h1>
                </div>
              </div>
              <div className="w-full border-b-1 border-gray-300  flex px-4 py-2 hover:bg-gray-100 cursor-pointer items-center">
                <div className="w-10 h-10 flex items-center justify-center">
                  <MdOutlineAdsClick className="text-2xl" />
                </div>
                <div className="ml-4">
                  <h1 className="text-[#333d42] text-sm">
                    Advertise on reddit
                  </h1>
                </div>
              </div>
              <Link to={`/settings/${user.id}`}>
                <div className="w-full border-b-1 border-gray-300 flex px-4 py-2 hover:bg-gray-100 cursor-pointer items-center">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <SlSettings className="text-2xl" />
                  </div>
                  <div className="ml-4">
                    <h1 className="text-[#333d42] text-sm">Settings</h1>
                  </div>
                </div>
              </Link>
              <div className="w-full flex px-4 py-2 hover:bg-gray-100 cursor-pointer items-center">
                <div className="w-10 h-10 flex items-center justify-center">
                  <CiWallet className="text-2xl" />
                </div>
                <div className="ml-4">
                  <h1 className="text-[#333d42] text-sm">
                    Contributor Program
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationBar;
