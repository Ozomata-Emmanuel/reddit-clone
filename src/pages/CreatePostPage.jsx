import { useContext, useState } from "react";
import { MdClose } from "react-icons/md";
import HomeSideBar from "../components/HomeSideBar";
import HomePageRight from "../components/HomePageRight";
import { AiOutlineMenu } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { CiImageOn } from "react-icons/ci";
import axios from "axios";
import { DataContext } from "../context/DataContext";
import { toast } from "react-toastify";

const CreatePostPage = () => {
  const { user } = useContext(DataContext)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [titleTextDis, setTitleTextDis] = useState(true);
  const [titleImageDis, setTitleImageDis] = useState(false);
  const [titleLinkDis, setTitleLinkDis] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const formData = new FormData();
  const [formdata, setFormdata] = useState({
    user_id: user.id,
    user_name: user.username,
    title: "",
    text: "",
    image: null,
    link: "",
  });

  const handleInput = (e) => {
    const { name, type, value, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        setFormdata(prev => ({ ...prev, [name]: file }));
      }
    } else {
      setFormdata(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formdata.title
    ) {
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
      
      formData.append("user_name", user.username);
      formData.append("user_id", user.id);
      formData.append("title", formdata.title);
      formData.append("text", formdata.text);
      formData.append("image", formdata.image);
      formData.append("link", formdata.link);

      const resp = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/reddit/api/posts/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (resp.data.success) {
        setFormdata({
          title: "",
          text: "",
          image: null,
          link: "",
        });
        setPreview(null);
        toast.success("Post created successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        console.log(resp.data.message);
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("An error occurred while creating the post", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
      setPreview(null);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setFormdata(prev => ({ ...prev, image: '' }));
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

  return (
    <>
      <div className="flex w-[100%]">
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
            <div className="CREATEPOST">
              <div className="w-full flex justify-between mt-5 items-center">
                <h1 className="text-[#333d42] text-2xl font-bold">
                  Create post
                </h1>
                <p className="text-sm font-semibold">Drafts</p>
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

                        {preview ? (
                          <div className="relative w-full h-64 flex items-center justify-center">
                            <img
                              src={preview}
                              alt="Preview"
                              className="max-h-full  rounded-xl object-contain"
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
                <div className="bg-[#f3f3f3] rounded-full text-gray-400 text-[15px] h-10 flex justify-center items-center">
                  <p className="px-4">Save Draft</p>
                </div>
                {loading ? (
                  <div className="bg-[#0602e9a8] rounded-full text-white font-semibold cursor-not-allowed text-[15px] h-10 flex justify-center items-center">
                    <p className="px-4">Posting</p>
                  </div>
                ) : (
                  <div
                    onClick={handleSubmit}
                    className="bg-[#0602e9] rounded-full text-white font-semibold cursor-pointer hover:bg-[#0602e9a8] text-[15px] h-10 flex justify-center items-center"
                  >
                    <p className="px-4">Post</p>
                  </div>
                )}
              </div>
              <div className="flex justify-center mt-30 mb-10">
                <div className="text-[12px] text-center grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-5 items-center  text-gray-500  ">
                  <p className="flex gap-3 w-full text-center">
                    <span className="hover:text-black hover:underline cursor-pointer">
                      Reddit Rules
                    </span>
                    <span className="hover:text-black hover:underline cursor-pointer">
                      Privacy Policy
                    </span>
                    <span className="hover:text-black hover:underline cursor-pointer">
                      User Agreement
                    </span>
                  </p>
                  <p className="hover:text-black hover:underline cursor-pointer">
                    Reddit, Inc. © 2025. All rights reserved.
                  </p>
                </div>
              </div>
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

export default CreatePostPage;
