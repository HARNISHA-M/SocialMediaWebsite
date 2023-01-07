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
import { ShowFollowingComponent } from '../components/ShowFollowingComponent';
import { Followers } from '../components/Followers';

interface data {
    Image:null;
}

export const Myprofile = () => {

    const urldata = useContext(Appcontext);
    
    const [user] = useAuthState(auth);

    // Query to get only current user posts
    const collectionRef = collection(db, "posts");
    const profileQuery = query(collectionRef, where("userId", "==", user?.uid+""));

    // list to store posts
    const [profilePost,setProfilePost] = useState<PostType[] | null>(null);

    const getPosts = async() =>{
        const data = await getDocs(profileQuery);
        setProfilePost(data.docs.map((doc)=>({...doc.data(),id:doc.id})) as PostType[]);
    }

    // followers and following count

    const followingData = useContext(Appcontext);
    const [followingCount,setFollowingCount] = useState<number>(0);
    const [followersCount,setFollowersCount] = useState<number>(0);

    useEffect(()=>{
       if(followingData && followingData.FollowingList) setFollowingCount(followingData?.FollowingList?.length);
       if(followingData && followingData.FollowersList) setFollowersCount(followingData.FollowersList.length);
    },[followingData?.FollowingList]);

    useEffect(()=>{
        getPosts();
    },[user?.uid]);

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

    return(
        <div>
            {user && 
                    <>
                        <p>{user?.displayName} <img src={(urldata && urldata.url) ? (urldata && urldata.url) : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"} width="100" height="100" ></img></p>
                    </>
            }

            <p>Following : {followingCount}</p>
            <p>Followers : {followersCount}</p>

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

            <ShowFollowingComponent></ShowFollowingComponent>

            <p>Followers:</p>

            <Followers></Followers>
        </div>
    )
}