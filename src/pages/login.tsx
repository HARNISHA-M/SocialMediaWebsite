import {auth,provider} from '../config/firebase';
import {signInWithPopup} from 'firebase/auth';
import {useNavigate} from "react-router-dom";

export const Login = () => {

    const navigate = useNavigate();

    const signInWithGoogle = async() => {
        const result = await signInWithPopup(auth,provider);
        console.log(result);
        navigate("/");
    }
    return(
        <div className="login">
            <i className="fa-solid fa-right-to-bracket"></i>
            <button onClick={signInWithGoogle}> <span>LogIn</span></button>
        </div>
    )
}