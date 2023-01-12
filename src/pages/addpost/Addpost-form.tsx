import {useForm} from "react-hook-form";
import * as yup from 'yup';
import {yupResolver} from "@hookform/resolvers/yup";
import {addDoc, collection } from "firebase/firestore";
import {db,auth} from "../../config/firebase"
import { useAuthState } from "react-firebase-hooks/auth";
import {useNavigate} from "react-router-dom";
import {storage} from "../../config/firebase";
import {uploadBytes,ref,getDownloadURL} from "firebase/storage";
import { useState } from "react";
import  {v4} from "uuid";
import '../../styles/createPost.css';

interface data {
    Description : string;
    Image:null;
}
export const Addpostform = () => {
    const schema = yup.object().shape({
        Image:yup.mixed().required("You must add images to your post"),
        Description:yup.string().required("You must add description..!"),
    });

    const {register,handleSubmit,formState:{errors}} = useForm<data>({
        resolver:yupResolver(schema)
    });

    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    
    const [imageUpload,setImageUpload] = useState<null|any>();
    const handleImage =(e:any) => {
        if(e.target.files[0])
        {
            setImageUpload(e.target.files[0]);
        }
    }
    const submitPost = async(data:data) => {
        const imageRef = ref(storage,`postImages/${imageUpload.name + v4()}`);
        await uploadBytes(imageRef,imageUpload).then(()=>{alert("Image uploaded")});
        const url= await getDownloadURL(imageRef);
        console.log(url);
        await addDoc(postsRef,{
            Description:data.Description,
            Url:url,
            username:user?.displayName,
            userId:user?.uid,
            likes:[],
            comments:[],
        });
        navigate("/");
    }

    const postsRef = collection(db, "posts");
    return (
        <div className="newPost">
            <form onSubmit={handleSubmit(submitPost)}>
                <div className="newForm">
                    <label>Post Image:</label>
                    <input type="file"  {...register("Image")}  onChange={handleImage}></input>
                    <p style={{color:"red"}}>{errors.Image?.message}</p>

                    <label>Post Description:</label>
                    <textarea  {...register("Description")}/>
                    <p style={{color:"red"}}>{errors.Description?.message}</p>

                    <input type="submit"></input>   
                </div>
            </form>
        </div>
    )
}