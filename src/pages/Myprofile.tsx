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
import '../styles/myProfile.css'
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
        getPosts();
        if(followingData && followingData.FollowingList) setFollowingCount(followingData?.FollowingList?.length);
        if(followingData && followingData.FollowersList) setFollowersCount(followingData.FollowersList.length);
    },[user?.uid,followingData?.FollowingList]);

    // for showing choose file option for profile
    const [editProfile,setEditProfile] = useState<Boolean>(false);

    // for string newly uploaded image
    const [imageUpload,setImageUpload] = useState<null|any>();

    const [isVisible,setIsVisible] = useState(0);
 
    // useEffect(()=>{
       
    // //    setIsVisible(0)
    // })
    
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

    const [postCount,setPostCount] = useState(0);
    const getPostCount =async () => {
            const postRef = collection(db,"posts");
             const data= await getDocs(postRef);
             setPostCount(data.docs.length)
            
        
    }

    useEffect( () => {
        getPostCount();
    },[])
    return(
        <div className="myProfile">
            <div className="topBar">
                  <div className="profilePic">
                    <img className="profilePicture" src={(urldata && urldata.url && urldata.url!=null ) ? (urldata && urldata.url) : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"} width="100" height="100" ></img>
                    <button className="editProfile" onClick={()=>{setEditProfile(!editProfile)}}><i className="fa-sharp fa-solid fa-pen"></i></button>
                    {editProfile && 
                        <form onSubmit={handleSubmit(submitPost)}>
                            <input type="file" onChange={handleImage}></input>
                            <button >Update</button>
                        </form>
                    } 
                    <span className="UserName">{(user?.displayName+"").split(" ")[0]}</span>
                    <span className="UserId">@{user?.displayName}</span>
                  </div>
                  <div className="profileDetails">
                    <div className="Posts"  onClick={()=>{setIsVisible(0)}}><span>&nbsp;&nbsp;&nbsp;{postCount}</span><br></br><span className="name">Posts</span></div>
                    <div className="Following" onClick={()=>{setIsVisible(1)}}><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{followingCount}</span><br></br><span className="name">Following</span></div>
                    <div className="Followers" onClick={()=>{setIsVisible(2);}}><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{followersCount}</span><br></br><span className="name">Followers</span></div>
                  </div>
            </div>
            <hr></hr>
            <div className={isVisible == 0 ? "visible" : "hide"}>
                {profilePost?.map((posts)=>(
                    <ShowPost post={posts} />
                ))}
            </div>

            <div className="followingWidth">
                <div className={isVisible == 1 ? "visible" : "hide"}>
                    <ShowFollowingComponent></ShowFollowingComponent>
                </div>
            </div>
            
            <div className="followingWidth">
                <div  className={isVisible == 2 ? "visible" : "hide"}>
                    <Followers></Followers>
                </div>
            </div>
            
            
        </div>
    )
}
