import {getDocs , collection, doc} from "firebase/firestore";
import { useEffect, useState } from "react";
import {db} from '../config/firebase';
import {ShowPost} from '../components/showPost';
import { createContext } from 'react';

export interface PostType {
    id:string,
    Description:string,
    Title:string,
    Url:string,
    userId:string,
    username:String,
    likes:string[],
    comments:{comment:string,commentuserId:string,commentuserName:string},
};

export interface ListContext{
    postList:PostType[] | null,
    setPostList:Function,
}

export const Homecontext = createContext<ListContext | null>(null);

export const Home = () => {
    const postRef = collection(db,"posts");
    const [postList,setPostList] = useState<PostType[] | null>(null);

    const getPosts = async() =>{
        const data= await getDocs(postRef);
        setPostList(data.docs.map((doc)=>({...doc.data(),id:doc.id})) as PostType[]);
    }

    useEffect(()=>{
        getPosts();
    },[]);
    
    return(
        <div>
            <Homecontext.Provider value={{postList:postList,setPostList:setPostList}}>

                {postList?.map((posts)=>(
                    <ShowPost post={posts} />
                ))};

            </Homecontext.Provider>
        </div>
    )
}