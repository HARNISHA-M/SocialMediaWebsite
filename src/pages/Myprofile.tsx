import { auth, db } from '../config/firebase';
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';
import { ShowPost } from '../components/showPost';
import { useEffect, useState } from 'react';
import { set } from 'immer/dist/internal';


export interface PostType {
    id:string,
    Description:string,
    Title:string,
    Url:string,
    userId:string,
    username:String,
    likes:String[],
};

export const Myprofile = () => {

    // for getting userid
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
    return(
        <div>
            {profilePost?.map((posts)=>(
                <ShowPost post={posts} />
            ))}
        </div>
    )
}