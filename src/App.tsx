import React, { useState } from 'react';
import './App.css';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import { Home } from './pages/Home';
import { Login } from './pages/login';
import { Addpost } from './pages/addpost/Addpost';
import {Navbar} from './components/Navbar';
import { Myprofile } from './pages/Myprofile';
import { createContext } from 'react';

export interface data{
  url:string;
  setUrl:Function;
  FollowingList:followingType[] | null;
  setFollowingList:Function;
  FollowersList:followingType[] | null;
  setFollowersList:Function;
}

export interface followingType{
  userId:string,
  userName:string,
}

export const Appcontext = createContext<data | null>(null);
function App() {

  const [url,setUrl] = useState<string | null>(null);
  const [followingList,setFollowingList] = useState<followingType[]|null>(null);
  const [followersList,setFollowersList] = useState<followingType[]|null>(null);

  return (
    <div className="App">
      <Appcontext.Provider value={{url:url+"",setUrl:setUrl,FollowingList:followingList,setFollowingList:setFollowingList,FollowersList:followersList,setFollowersList:setFollowersList}}>
        <Router>
          <Navbar></Navbar>
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/addpost' element={<Addpost />}></Route>
            <Route path='/myprofile' element={<Myprofile />}></Route>
          </Routes>
        </Router>
      </Appcontext.Provider>
    </div>
  )
}
export default App;
