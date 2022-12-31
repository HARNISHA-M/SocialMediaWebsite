import { auth, db } from '../config/firebase';
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { ShowPost } from '../components/showPost';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getDownloadURL, uploadBytes ,ref} from 'firebase/storage';
import {storage} from "../config/firebase";
import { useContext } from 'react';
import { Appcontext } from '../App';
import { PostType } from './Home';

interface data {
    Image:null;
}

export const Myprofile = () => {

    const urldata = useContext(Appcontext);
    
    const [user] = useAuthState(auth);

    // Query to get only current user posts
    const collectionRef = collection(db, "posts");
    const profileQuery = query(collectionRef, where("userId", "==", user?.uid));

    // list to store posts
    const [profilePost,setProfilePost] = useState<PostType[] | null>(null);

    const getPosts = async() =>{
        const data = await getDocs(profileQuery);
        setProfilePost(data.docs.map((doc)=>({...doc.data(),id:doc.id})) as PostType[]);
    }

    useEffect(()=>{
        getPosts();
    },[]);

    // for showing choose file option for profile
    const [editProfile,setEditProfile] = useState<Boolean>(false);

    // for string newly uploaded image
    const [imageUpload,setImageUpload] = useState<null|any>();

    
    const handleImage =(e:any) => {
        if(e.target.files[0])
        {
            setImageUpload(e.target.files[0]);
        }
        // console.log(imageUpload);
    }

    
    const {register,handleSubmit} = useForm<data>();

    
    const submitPost = async() => {
        const imageRef = ref(storage,"Profile/"+user?.uid);
        await uploadBytes(imageRef,imageUpload).then(()=>{alert("Image uploaded")}).catch((e)=>{console.log("error"+e)});
        const url= await getDownloadURL(imageRef);
        urldata && urldata.setUrl(url);
        setEditProfile(false);
    }

    // function for updating profile pic

    return(
        <div>
            {user && 
                    <>
                        <p>{user?.displayName} <img src={(urldata && urldata.url) ? (urldata && urldata.url) : user?.photoURL|| ""} width="100" height="100" ></img></p>
                    </>
            }
            <button onClick={()=>{setEditProfile(!editProfile)}}>Edit profile</button>
            {editProfile && 
                <form onSubmit={handleSubmit(submitPost)}>
                    <input type="file" onChange={handleImage}></input>
                    <button >Update</button>
                </form>
            }
            {profilePost?.map((posts)=>(
                <ShowPost post={posts} />
            ))}
        </div>
    )
}