import { doc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../config/firebase';
import {PostType} from './Home'
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

    const AddId = async() =>{
        await updateDoc(docRef,{likes:[...LikeId,user?.uid]});
        setLikeId([...LikeId,user?.uid]);
    }

    const removeId = async() =>{
        const likeids = LikeId.filter((id:String) => id !== user?.uid);
        await updateDoc(docRef,{likes:likeids});
        setLikeId(likeids);
    }

    const hasLiked = LikeId.includes(user?.uid);

    return(
        <div>
            <div className='title'>
                <h1>{post.Title}</h1>
            </div>
            <div className='Description'>
                <p>{post.Description}</p>
            </div>
            <div className='username'>
                <p>@{post.username}</p>
            </div>
            <div className='footer'>
                <button onClick={hasLiked ? removeId: AddId}>{hasLiked? <>&#128078;</>: <>&#128077;</>}</button>
                <p>Likes:{LikeId.length}</p>
            </div>
        </div>
    )
}