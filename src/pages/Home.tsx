import {getDocs , collection, doc, getDoc} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import {auth, db} from '../config/firebase';
import {ShowPost} from '../components/showPost';
import { createContext } from 'react';
import { Appcontext } from "../App";
import { useAuthState } from "react-firebase-hooks/auth";

export interface PostType {
    id:string,
    Description:string,
    Url:string,
    userId:string,
    username:string,
    likes:string[],
    comments:{comment:string,commentuserId:string,commentuserName:string},
    following:string,
};

export interface ListContext{
    postList:PostType[] | null,
    setPostList:Function,
}

export const Homecontext = createContext<ListContext | null>(null);
export const Home = () => {

    const [user] = useAuthState(auth);

    //  reference to collection for storing post details
    const postRef = collection(db,"posts");
    const [postList,setPostList] = useState<PostType[] | null>(null);

    const getPosts = async() =>{
        const data= await getDocs(postRef);
        await setPostList(data.docs.map((doc)=>({...doc.data(),id:doc.id})) as PostType[]);
    }

    
    const followingData = useContext(Appcontext);
    
    const getFollowingList = async() =>
    {
        const userDetailsRef = doc(db, "userDetails", user?.uid+"");
        const followingIds = await getDoc(userDetailsRef);
        
        if (followingIds.exists()) {
            followingData?.setFollowingList(followingIds.data().following);
            followingData?.setFollowersList(followingIds.data().followers);
            console.log("Document data following:", followingIds.data().following);
            console.log("Document data followers:", followingIds.data().followers);
        } 
        else 
        {

            followingData?.setFollowingList([]);
            followingData?.setFollowersList([]);
            console.log("No such document!");
        }

        
    }

    useEffect(()=>{
        getPosts();
        getFollowingList();
    },[user?.uid])

    return(
        <div>
            <Homecontext.Provider value={{postList:postList,setPostList:setPostList}}>

                {postList?.map((posts)=>(
                    <ShowPost post={posts} key={posts.id}/>
                ))}

            </Homecontext.Provider>
        </div>
    )
}