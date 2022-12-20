import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {addDoc, collection } from "firebase/firestore";
import {db,auth} from "../../config/firebase"
import { useAuthState } from "react-firebase-hooks/auth";
import {useNavigate} from "react-router-dom";
import {storage} from "../../config/firebase";
import {uploadBytes,ref,getDownloadURL} from "firebase/storage";
import { useState } from "react";
import  {v4} from "uuid";
interface data {
    Title:string;
    Description : string;
    Image:null;
}
export const Addpostform = () => {

    const schema = yup.object().shape({
        Title:yup.string().required("You must add title..!"),
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
            Title:data.Title,
            Description:data.Description,
            Url:url,
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

                <input type="file"  {...register("Image")}  onChange={handleImage}></input>
                <p style={{color:"red"}}>{errors.Image?.message}</p>

                <textarea placeholder="Description.." {...register("Description")}/>
                <p style={{color:"red"}}>{errors.Description?.message}</p>

                <input type="submit"></input>   
            </form>
        </div>
    )
}