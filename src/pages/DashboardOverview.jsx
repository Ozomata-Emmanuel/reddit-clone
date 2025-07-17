import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { 
  FiUsers, 
  FiFileText, 
  FiMessageSquare, 
  FiBarChart2,
  FiTrendingUp,
  FiActivity
} from 'react-icons/fi';

const DashboardOverview = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const engagementRate = allPosts.length > 0 && allComments.length > 0
    ? Math.round((allComments.length / allPosts.length) * 100)
    : 0;

  const getActivityData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const activityData = days.map(day => ({ 
      day, 
      posts: 0, 
      comments: 0 
    }));

    allPosts.forEach(post => {
      if (!post?.createdAt) return;
      try {
        const date = new Date(post.createdAt);
        const dayIndex = date.getDay();
        activityData[dayIndex].posts++;
      } catch (e) {
        console.error('Error processing post date:', e);
      }
    });

    allComments.forEach(comment => {
      if (!comment?.createdAt) return;
      try {
        const date = new Date(comment.createdAt);
        const dayIndex = date.getDay();
        activityData[dayIndex].comments++;
      } catch (e) {
        console.error('Error processing comment date:', e);
      }
    });

    return activityData;
  };

  const activityData = getActivityData();
  const maxActivity = Math.max(
    1, 
    ...activityData.map(d => Math.max(d.posts, d.comments))
  );

  const stats = [
    { 
      title: "Total Users", 
      value: allUsers.length.toLocaleString(), 
      change: "+12.5%", 
      icon: <FiUsers className="text-2xl" /> 
    },
    { 
      title: "Total Posts", 
      value: allPosts.length.toLocaleString(), 
      change: "+8.2%", 
      icon: <FiFileText className="text-2xl" /> 
    },
    { 
      title: "Comments", 
      value: allComments.length.toLocaleString(), 
      change: "+5.7%", 
      icon: <FiMessageSquare className="text-2xl" /> 
    },
    { 
      title: "Engagement Rate", 
      value: `${engagementRate}%`, 
      change: "+3.2%", 
      icon: <FiBarChart2 className="text-2xl" /> 
    }
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersResp, postsResp, commentsResp] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/reddit/api/users/allusers`),
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/reddit/api/posts/all`),
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/reddit/api/comments/all`)
      ]);

      setAllUsers(usersResp.data?.success ? usersResp.data.data : []);
      setAllPosts(postsResp.data?.success ? postsResp.data.data : []);
      setAllComments(commentsResp.data?.success ? commentsResp.data.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setAllUsers([]);
      setAllPosts([]);
      setAllComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-800">{stat.value}</h3>
                <p className={`text-sm mt-2 ${stat.change.startsWith('+') ? 'text-orange-500' : 'text-gray-500'}`}>
                  {stat.change} from last week
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50 text-orange-500">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Weekly Activity</h2>
          <div className="flex space-x-4">
            <span className="flex items-center text-sm text-gray-600">
              <span className="w-3 h-3 bg-orange-400 rounded-full mr-2"></span>
              Posts
            </span>
            <span className="flex items-center text-sm text-gray-600">
              <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
              Comments
            </span>
          </div>
        </div>
        <div className="flex items-end space-x-4 h-64">
          {activityData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="flex items-end w-full justify-center space-x-1 h-full">
                <div 
                  className="w-4/12 bg-orange-300 rounded-t hover:bg-orange-400 transition-colors"
                  style={{ 
                    height: `${(data.posts / maxActivity) * 100}px`,
                    minHeight: '10px'
                  }}
                  title={`${data.posts} posts`}
                ></div>
                <div 
                  className="w-4/12 bg-gray-300 rounded-t hover:bg-gray-400 transition-colors"
                  style={{ 
                    height: `${(data.comments / maxActivity) * 100}px`,
                    minHeight: '10px'
                  }}
                  title={`${data.comments} comments`}
                ></div>
              </div>
              <span className="text-xs text-gray-500 mt-2">{data.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
            <FiTrendingUp className="text-orange-500" />
          </div>
          <div className="space-y-4">
            {allPosts.slice(0, 5).map((post, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700 truncate max-w-xs">{post.title}</span>
                <span className="text-orange-500 text-sm font-medium">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">New Users</h2>
            <FiActivity className="text-orange-500" />
          </div>
          <div className="space-y-4">
            {allUsers.slice(0, 5).map((user, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">u/{user.username}</span>
                <span className="text-orange-500 text-sm font-medium">
                  {new Date(user.date_registered).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;