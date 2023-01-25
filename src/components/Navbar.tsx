import {Link, NavLink, useNavigate} from "react-router-dom";
import {auth, storage} from "../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {signOut} from "firebase/auth"
import '../styles/navbar.css';
import { getDownloadURL,ref } from "firebase/storage";
import { useContext, useEffect } from 'react';
import { Appcontext } from '../App';
import { Login } from "../pages/login";

export const Navbar = () => {

    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const logout = async() => {
        await signOut(auth);   
        navigate("/login");
    }

    const urldata = useContext(Appcontext);

    const profilePic = async () => {
        const imageRef = ref(storage,"Profile/"+user?.uid);
        await getDownloadURL(imageRef)
        .then((urlPic)=>{
            urldata?.setUrl(urlPic);
           
        }).catch( (e) => {
            console.log(urldata?.url)
        });
            
    }
    const myFunction = () => {
        document?.getElementById("myDropdown")?.classList.toggle("show");
    }
    
    document.getElementById("myDropdown")?.addEventListener("click",( () => {
        document?.getElementById("myDropdown")?.classList.remove("show");
    })); 


    useEffect(()=>{
        profilePic();
    },[]);

    useEffect(()=>{
        if(user && user?.uid.length>2)
        {
            if(document?.getElementsByClassName("navbar")[0]?.classList.contains("margin"))
            {
                document?.getElementsByClassName("navbar")[0]?.classList.remove("margin");
            }
        }
        else
        {
            document?.getElementsByClassName("navbar")[0]?.classList.add("margin");
        }
    });
    
    return (
        <div className="navbar">
           <div>
                <div>
                    {user && 
                        <>
                            <div className="profileBackground"></div>
                            {urldata && urldata.url.length>5 && <img src={urldata && urldata.url}  width="50" height="50" className="ProfileImg"></img>}
                            {urldata && urldata.url.length<5 && <img src={require('./profileDummy.png')} width="50" height="50" className="ProfileImg"></img>}
                            <div className="UserName">{user?.displayName?.split(" ")[0]}</div>
                        </>
                    }
                </div>
                <div className="dropdown">
                    <button onClick={myFunction} className="dropbtn"><i className="fa-solid fa-bars"></i></button>
                    <div id="myDropdown" className="dropdown-content">
                        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : 'inactive')}><i className="fa-solid fa-house"></i><span>Home</span></NavLink>
                        {user ? <NavLink to="/addpost" className={({ isActive }) => (isActive ? 'active' : 'inactive')}><i className="fa-solid fa-plus"></i><span>Create Post</span></NavLink> : <Login /> }
                        {user &&
                            <>
                                <NavLink to='/myprofile' className={({ isActive }) => (isActive ? 'active' : 'inactive')}><i className="fa-solid fa-user"></i><span>My Profile</span></NavLink>
                                <a onClick={logout} className="inactive"><i className="fa-solid fa-right-from-bracket"></i><span>LogOut</span></a>
                            </>
                        }
                    </div>
                </div>
           </div>
        </div>
    )
} 