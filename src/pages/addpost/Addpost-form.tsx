import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {addDoc, collection } from "firebase/firestore";
import {db,auth} from "../../config/firebase"
import { useAuthState } from "react-firebase-hooks/auth";
import {useNavigate} from "react-router-dom";

interface data {
    Title:string;
    Description : string;
}
export const Addpostform = () => {

    const schema = yup.object().shape({
        Title:yup.string().required("You must add title..!"),
        Description:yup.string().required("You must add description..!"),
    });

    const {register,handleSubmit,formState:{errors}} = useForm<data>({
        resolver:yupResolver(schema)
    });

    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const submitPost = async(data:data) => {
        await addDoc(postsRef,{
            ...data,
            username:user?.displayName,
            userId:user?.uid,
            likes:[],
        });
        navigate("/");
    }

    const postsRef = collection(db, "posts");
    return (
        <div>
            <form onSubmit={handleSubmit(submitPost)}>
                <input placeholder="Title.." {...register("Title")} style={{marginTop:20}}/>
                <p style={{color:"red"}}>{errors.Title?.message}</p>
                <textarea placeholder="Description.." {...register("Description")}/>
                <p style={{color:"red"}}>{errors.Description?.message}</p>
                <input type="submit"></input>   
            </form>
        </div>
    )
}