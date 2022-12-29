import { doc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../config/firebase';
import {PostType} from '../pages/Home';
import {Comment} from './Comment';

interface propType {
    post:PostType;
}

export const ShowPost = (props:propType) => {
    const {post} = props;
   
    const [LikeId,setLikeId] = useState([] as any);

    useEffect(()=>{
        setLikeId(post.likes);
    },[]);

    const [user] = useAuthState(auth);
    const docRef = doc(db,"posts",post.id);

    // Adding the user id who liked the post
    const AddId = async() =>{
        await updateDoc(docRef,{likes:[...LikeId,user?.uid]});
        setLikeId([...LikeId,user?.uid]);
    }

    // Removing the user id who dislike the post
    const removeId = async() =>{
        const likeids = LikeId.filter((id:String) => id !== user?.uid);
        await updateDoc(docRef,{likes:likeids});
        setLikeId(likeids);
    }

    // Boolean to check whether person liked the post or not
    const hasLiked = LikeId.includes(user?.uid);

    return(
        <div>
            <div className='title'>
                <h1>{post.Title}</h1>
            </div>
            {post.Url!=null && <div className='image'>
                <img src={post.Url} style={{width: '300px', height:'200px'}}></img>
            </div>}
            <div className='Description'>
                <p>{post.Description}</p>
            </div>
            <div className='username'>
                <p>@{post.username}</p>
            </div>
            <div className='footer'>
                <button onClick={hasLiked ? removeId: AddId}>{hasLiked? <>&#128078;</>: <>&#128077;</>}</button>
                <p>Likes:{LikeId.length}</p>
                <div>
                    <Comment postId={post.id} postComments={post.comments}  />
                </div>
            </div>
        </div>
    )
}