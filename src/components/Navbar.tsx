import {Link, useNavigate} from "react-router-dom";
import {auth} from "../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {signOut} from "firebase/auth"
import './navbar.css';
import { async } from "@firebase/util";
export const Navbar = () => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const logout = async() => {
        await signOut(auth);   
        navigate("/login");
    }
    return (
        <div className="navbar">
           <div>
                <Link to="/" className="navitem">Home</Link>
                {user ? <Link to="/addpost" className="navitem">Add post</Link> : <Link to="/login" className="navitem">Login</Link>}
                <div>
                   {user && 
                      <>
                        <p>{user?.displayName} <img src={user?.photoURL || ""} width="20" height="20"></img></p>
                        <Link to='/myprofile' className="navitem">My profile</Link>
                        <button onClick={logout}>Log-out</button>
                      </>}
                </div>
           </div>
        </div>
    )
} 