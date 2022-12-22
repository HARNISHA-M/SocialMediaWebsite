import React from 'react';
import './App.css';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import { Home } from './pages/Home';
import { Login } from './pages/login';
import { Addpost } from './pages/addpost/Addpost';
import {Navbar} from './components/Navbar';
import { Myprofile } from './pages/Myprofile';


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar></Navbar>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/addpost' element={<Addpost />}></Route>
          <Route path='/myprofile' element={<Myprofile />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
