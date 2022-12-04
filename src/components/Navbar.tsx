import {Link} from "react-router-dom";
import {auth} from "../config/firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import './navbar.css';
export const Navbar = () => {
    const [user] = useAuthState(auth);
    return (
        <div className="navbar">
           <div>
                <Link to="/" className="links">Home</Link>
                <Link to="/login" className="links">Login</Link>
                <div>{user?.displayName}</div>
        
           </div>
        </div>
    )
} 