import axios from "axios";
import { useEffect } from "react";
import { createContext, useState } from "react";

export const DataContext = createContext();

function DataProvider({children}) {
  const localstorageData = localStorage.getItem("reddit_user_id");
  const [user, setUser] = useState({});
  const [load, setLoad] = useState(false);

  const getUser = async(id)=> {
    const resp = await axios.get(`https://reddit-clone-backend-sdts.onrender.com/reddit/api/user/${id}`);
    setLoad(true)
    if (resp.data.success){
      setUser(resp.data.data);
    } else {
      setLoad(false);
    }
  };

  
  useEffect(() => {
    if (localstorageData) {
      getUser(localstorageData);
    } else {
      setUser({})  
    };
  }, []);
  return <DataContext.Provider value={{ user, setUser, getUser, load }}>{children}</DataContext.Provider>
};

export default DataProvider