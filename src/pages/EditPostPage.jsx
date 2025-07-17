import { useContext, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import HomeSideBar from "../components/HomeSideBar";
import HomePageRight from "../components/HomePageRight";
import { AiOutlineMenu } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { CiImageOn } from "react-icons/ci";
import { MdOutlineClose } from "react-icons/md";
import { RiLoader5Fill } from "react-icons/ri";
import { RiLoader4Fill } from "react-icons/ri";
import { TbLoader2 } from "react-icons/tb";
import { TbLoader3 } from "react-icons/tb";
import { DataContext } from "../context/DataContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [titleTextDis, setTitleTextDis] = useState(true);
  const [titleImageDis, setTitleImageDis] = useState(false);
  const [titleLinkDis, setTitleLinkDis] = useState(false);
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState(null);
  const [preview, setPreview] = useState(null);
  const formData = new FormData();
  const [formdata, setFormdata] = useState({
    title: "",
    text: "",
    image: null,
    link: "",
  });

  useEffect(() => {
    if (post) {
      setFormdata({
        title: post.title || "",
        text: post.text || "",
        image: post.image || "",
        link: post.link || "",
      });
      if (post.image) {
        setPreview(post.image);
      }
    }
  }, [post]);

  const handleInput = (e) => {
    const { name, type, value, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        setFormdata((prev) => ({ ...prev, [name]: file }));
      }
    } else {
      setFormdata((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formdata.title) {
      toast.error("Title field is required", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setLoading(false);
      return;
    }

    try {
      formData.append("title", formdata.title);
      formData.append("text", formdata.text);
      formData.append("image", formdata.image);
      formData.append("link", formdata.link);

      const resp = await axios.put(
        `https://reddit-clone-backend-sdts.onrender.com/reddit/api/posts/edit/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (resp.data.success) {
        toast.success("Post edited successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setFormdata({
          title: "",
          text: "",
          image: null,
          link: "",
        });
        setPreview(null);
        navigate(-1);
      } else {
        toast.error("An error occurred while editing the post", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error editing post:", error);
      toast.error("An error occurred while editing the post", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setFormdata((prev) => ({ ...prev, image: "" }));
  };

  const showTitleTextDisp = () => {
    setTitleTextDis(true);
    setTitleImageDis(false);
    setTitleLinkDis(false);
  };

  const showTitleImageDisp = () => {
    setTitleTextDis(false);
    setTitleImageDis(true);
    setTitleLinkDis(false);
  };

  const showTitleLinkDisp = () => {
    setTitleTextDis(false);
    setTitleImageDis(false);
    setTitleLinkDis(true);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const getSinglePost = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(
          `https://reddit-clone-backend-sdts.onrender.com/reddit/api/posts/${id}`
        );
        if (resp.data.success) {
          setPost(resp.data.data);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Failed to load post data", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    getSinglePost();
  }, [id]);

  return (
    <>
      <div className="flex max-w-full">
        <div className="hidden lg:block md:block">
          {isSidebarOpen && (
            <div className="w-[220px]">
              <HomeSideBar />
            </div>
          )}
        </div>
        <div className="lg:w-[70%] w-full lg:ml-[20px] md:ml-[10px] lg:mx-auto px-7 mt-14 relative">
          <div className="border-gray-300 border-l-1 hidden lg:block md:block w-6 h-screen fixed">
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
                <div className="EDITPOST">
                  <div className="w-full flex justify-between mt-5 items-center">
                    <h1 className="text-[#333d42] text-2xl font-bold">
                      {" "}
                      Edit post
                    </h1>
                    <div
                      onClick={() => navigate(-1)}
                      className="flex gap-2 cursor-pointer items-center bg-gray-100 pr-4 rounded-full"
                    >
                      <div className="w-8 h-8 flex justify-center items-center hover:bg-gray-200 rounded-full cursor-pointer">
                        <MdOutlineClose className="text-lg" />
                      </div>
                      <p className="font-semibold">Cancel editing</p>
                    </div>
                  </div>
                  <div className="bg-[#e5ebee] mt-4 rounded-full w-50 flex items-center justify-between h-10 px-2">
                    <span className="rounded-full text-[#e5ebee] bg-black h-7 w-7 font-bold text-center">
                      r/
                    </span>
                    <p className="font-semibold text-sm">Select a community</p>
                    <IoIosArrowDown />
                  </div>
                  <div className="mt-4">
                    <div className="flex">
                      <div
                        onClick={showTitleTextDisp}
                        className="cursor-pointer font-semibold text-[14px] px-4 hover:bg-gray-200 "
                      >
                        {titleTextDis ? (
                          <p className="border-b-4 border-blue-600 py-3 ">Text</p>
                        ) : (
                          <p className="py-3 ">Text</p>
                        )}
                      </div>
                      <div
                        onClick={showTitleImageDisp}
                        className="cursor-pointer font-semibold text-[14px] px-4 hover:bg-gray-200 "
                      >
                        {titleImageDis ? (
                          <p className="border-b-4 border-blue-600 py-3 ">
                            Image & Video
                          </p>
                        ) : (
                          <p className="py-3 ">Image & Video</p>
                        )}
                      </div>
                      <div
                        onClick={showTitleLinkDisp}
                        className="cursor-pointer font-semibold text-[14px] px-4 hover:bg-gray-200 "
                      >
                        {titleLinkDis ? (
                          <p className="border-b-4 border-blue-600 py-3 ">Link</p>
                        ) : (
                          <p className="py-3 ">Link</p>
                        )}
                      </div>
                    </div>
                  </div>
                  {titleTextDis ? (
                    <div className="mt-3">
                      <div className="mt-4">
                        <input
                          className="w-full px-3 py-4 border border-gray-300 rounded-2xl hover:border-gray-400 hover:bg-gray-100 placeholder:text-[16px] focus:outline-2 focus:outline-blue-600 focus:border-0 focus:bg-gray-100"
                          type="text"
                          placeholder="Title *"
                          name="title"
                          value={formdata.title}
                          onChange={handleInput}
                        />
                      </div>
                      <p className="text-right text-[13px] pr-5 pt-1 text-gray-600">
                        {formdata.title.length}/300
                      </p>
                      <div className="mt-4">
                        <textarea
                          className="placeholder:text-[16px] outline-0  w-[100%] px-3 py-4 border-1 border-gray-300 rounded-2xl h-30 focus:border-gray-400"
                          name="text"
                          value={formdata.text}
                          onChange={handleInput}
                          id=""
                        ></textarea>
                      </div>
                    </div>
                  ) : titleImageDis ? (
                    <div className="mt-3">
                      <div className="mt-4">
                        <input
                          className="w-full px-3 py-4 border border-gray-300 rounded-2xl hover:border-gray-400 hover:bg-gray-100 placeholder:text-[16px] focus:outline-2 focus:outline-blue-600 focus:border-0 focus:bg-gray-100"
                          type="text"
                          placeholder="Title *"
                          name="title"
                          value={formdata.title}
                          onChange={handleInput}
                        />
                      </div>
                      <p className="text-right text-[13px] pr-5 pt-1 text-gray-600">
                        {formdata.title.length}/300
                      </p>
                      <div className="mt-4">
                        <div className="space-y-4">
                          <label className="relative flex flex-col items-center justify-center px-6 py-8 border-2 border-gray-300 rounded-3xl border-dashed cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <input
                              name="image"
                              type="file"
                              onChange={handleInput}
                              className="hidden"
                            />

                            {post.image &&
                            preview &&
                            preview.length === formdata.image.length ? (
                              <div className="relative w-full h-64 flex items-center justify-center">
                                <img
                                  src={
                                    post.image.includes("uploads")
                                      ? `https://reddit-clone-backend-sdts.onrender.com/${post.image}`
                                      : post.image
                                  }
                                  alt="image"
                                  className="max-h-full max-w-full rounded-xl object-contain"
                                />
                                <button
                                  type="button"
                                  onClick={removeImage}
                                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                >
                                  <MdClose className="text-gray-600 text-lg" />
                                </button>
                              </div>
                            ) : preview ? (
                              <div className="relative w-full h-64 flex items-center justify-center">
                                <img
                                  src={preview}
                                  alt="Preview main"
                                  className="max-h-full max-w-full rounded-xl object-contain"
                                />
                                <button
                                  type="button"
                                  onClick={removeImage}
                                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                >
                                  <MdClose className="text-gray-600 text-lg" />
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-3 text-center">
                                <div className="flex text-gray-400 text-6xl justify-center">
                                  <CiImageOn className="opacity-70" />
                                </div>
                                <div className="flex flex-col items-center space-y-1">
                                  <span className="text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors">
                                    Browse files
                                  </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">
                                  Supports JPG, PNG, WEBP
                                </p>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 mb-10">
                      <div className="mt-4">
                        <input
                          className="placeholder:text-[16px] focus:border-0 focus:bg-gray-100 focus:outline-2 outline-blue-600 w-[100%] px-3 py-4 border-1 border-gray-300 hover:bg-gray-100 rounded-2xl hover:border-gray-400"
                          type="text"
                          placeholder="Title *"
                          name="title"
                          value={formdata.title}
                          onChange={handleInput}
                        />
                      </div>
                      <p className="text-right text-[13px] pr-5 pt-1 text-gray-600">
                        {formdata.title.length}/300
                      </p>
                      <div className="mt-4">
                        <input
                          className="placeholder:text-[16px] focus:border-0 focus:bg-gray-100 focus:outline-2 outline-blue-600 w-[100%] px-3 py-4 border-1 border-gray-300 hover:bg-gray-100 rounded-2xl hover:border-gray-400"
                          type="text"
                          placeholder="https://your-link.com"
                          name="link"
                          value={formdata.link}
                          onChange={handleInput}
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3 justify-end mt-3">
                    {loading ? (
                      <div className="bg-[#0602e9a8] rounded-full text-white font-semibold cursor-not-allowed text-[15px] h-10 flex justify-center items-center">
                        <p className="px-4">Updating</p>
                      </div>
                    ) : (
                      <div
                        onClick={handleSubmit}
                        className="bg-[#0602e9] rounded-full text-white font-semibold cursor-pointer hover:bg-[#0602e9a8] text-[15px] h-10 flex justify-center items-center"
                      >
                        <p className="px-4">Update</p>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center mt-30 mb-10">
                    <div className="text-[12px] flex gap-5 items-center  text-gray-500  ">
                      <p className="hover:text-black hover:underline cursor-pointer">
                        Reddit Rules
                      </p>
                      <p className="hover:text-black hover:underline cursor-pointer">
                        Privacy Policy
                      </p>
                      <p className="hover:text-black hover:underline cursor-pointer">
                        User Agreement
                      </p>
                      <p className="hover:text-black hover:underline cursor-pointer">
                        Reddit, Inc. © 2025. All rights reserved.
                      </p>
                    </div>
                  </div>
                </div>
              )
            }
          </div>
        </div>
        <div className="lg:w-[280px] hidden lg:block mr-30">
          <HomePageRight />
        </div>
      </div>
    </>
  );
};

export default EditPostPage;
