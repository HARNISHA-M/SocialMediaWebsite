import { doc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../config/firebase';
import {PostType} from '../pages/Home';
import {Comment} from './Comment';
import { DeletePost } from './DeletePost';
import { Following } from './Following';
import { ShowProfile } from "./showProfile";
import '../styles/post.css';

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
        <div className="post-block">
            <div className='top-post'>
                <div className='profileAndName'>
                    <ShowProfile postUserId={post.userId}></ShowProfile>
                    <h3>{post.username}</h3>
                </div>
                <div>
                    {user?.uid == post.userId && <DeletePost postId = {post.id} imageUrl = {post.Url}></DeletePost>}
                    {user?.uid != post.userId && <Following userId = {post.userId}  userName = {post.username}></Following>}
                </div>
            </div>
            <div className="middleWidth">
                <div className='post-middle'>
                    <p className='Description'>{post.Description}</p>
                    {post.Url!=null && <div className='image'>
                    <img src={post.Url} style={{width: '300px', height:'200px'}}></img>
                    </div>}
                    
                </div>
                

                <div className='footer'>
                    <button onClick={hasLiked ? removeId: AddId}>{hasLiked ?  <i className="fa-solid fa-heart"></i> : <i className="fa-regular fa-heart"></i>}</button>
                    <p>Liked by {LikeId.length} people</p>
                </div>
            </div>
            <div>
                <Comment postId={post.id} postComments={post.comments}  />
            </div>
            
            
        </div>
    )
}