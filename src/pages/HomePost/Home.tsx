import {getDocs , collection, doc} from "firebase/firestore";
import { useEffect, useState } from "react";
import {db} from '../../config/firebase';
import {ShowPost} from './showPost';

export interface PostType {
    id:string,
    Description:string,
    Title:string,
    userId:string,
    username:String,
};
export const Home = () => {
    const postRef = collection(db,"posts");
    const [postList,setPostList] = useState<PostType[] | null>(null);

    const getPosts = async() =>{
        const data= await getDocs(postRef);
        setPostList(data.docs.map((doc)=>({...doc.data(),id:doc.id})) as PostType[]);
        console.log(data.docs.map((doc)=>({...doc.data(),id:doc.id})) as PostType[])
    }

    useEffect(()=>{
        getPosts();
    },[]);
    
    return(
        <div>
            {postList?.map((posts)=>(
                <ShowPost post={posts} />
            ))}
        </div>
    )
}