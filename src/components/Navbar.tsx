import {Link} from "react-router-dom";
import {auth} from "../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {signOut} from "firebase/auth"
import './navbar.css';
import { async } from "@firebase/util";
export const Navbar = () => {
    const [user] = useAuthState(auth);
    const logout = async() => {
        await signOut(auth);
    }
    return (
        <div className="navbar">
           <div>
                <Link to="/">Home</Link>
                {user ? <Link to="/addpost">Add post</Link> : <Link to="/login">Login</Link>}
                <div>
                   {user && 
                      <>
                        <p>{user?.displayName} <img src={user?.photoURL || ""} width="20" height="20"></img></p>
                        <button onClick={logout}>Log-out</button>
                      </>}
                </div>
        
           </div>
        </div>
    )
} 