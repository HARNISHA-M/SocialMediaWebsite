import {Link, useNavigate} from "react-router-dom";
import {auth, storage} from "../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {signOut} from "firebase/auth"
import './navbar.css';
import { getDownloadURL,ref } from "firebase/storage";
import { useContext, useEffect } from 'react';
import { Appcontext } from '../App';

export const Navbar = () => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const logout = async() => {
        await signOut(auth);   
        navigate("/login");
    }

    const urldata = useContext(Appcontext);

    const profilePic = async () => {
        if(!user?.uid) return ;
        try
        {
            const imageRef = ref(storage,"Profile/"+user?.uid);
            const url= await getDownloadURL(imageRef)
            .then((url)=>{
                urldata?.setUrl(url);
            });
            
        }
        catch(e)
        {
            urldata && urldata.setUrl("");
            // alert("error"+e);
        }
    }

    useEffect(()=>{
        profilePic();
    },[user]);
    return (
        <div className="navbar">
           <div>
                <Link to="/" className="navitem">Home</Link>
                {user ? <Link to="/addpost" className="navitem">Add post</Link> : <Link to="/login" className="navitem">Login</Link>}
                <div>
                   {user && 
                      <>
                        <p>{user?.displayName} <img src={(urldata && urldata.url) ? (urldata && urldata.url) : user?.photoURL|| ""} width="50" height="50" ></img></p>

                        <Link to='/myprofile' className="navitem">My profile</Link>
                        <button onClick={logout}>Log-out</button>
                      </>}
                </div>
           </div>
        </div>
    )
} 