import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../config/firebase';
import {useForm} from "react-hook-form";
import { doc, updateDoc } from 'firebase/firestore';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';


interface commentForm {
    Title:string;
}

interface commentType
{
    comment:string;
    commentuserId:string;
    commentuserName:string;
}

interface commentProps {
    postId:string;
    postComments:commentType[];
}


export const Comment = (props:any|commentProps) => {

    // console.log(props.postComments);
    useEffect(()=>{
        setCommentList(props.postComments);
    },[]);

    const [user] = useAuthState(auth);
    const docRef = doc(db,"posts",props.postId);

    const schema = yup.object().shape({
        Title:yup.string().required("You must add comment..!"),
    });

    const {register,handleSubmit,formState:{errors}} = useForm<commentForm>({
        resolver:yupResolver(schema)
    });

    // state for new comment
    const [newcomment,setNewComment] = useState<string>();

    // creating state for comments
    const [commentList,setCommentList] = useState<commentType[] | any>();

    // submiting comment
    const submitComment = async(e:any) => {
        // e.preventDefault();
        await updateDoc(docRef,{comments:[...commentList,{"comment":newcomment,"commentuserId":user?.uid,"commentuserName":user?.displayName}]});
        setCommentList([...commentList,{"comment":newcomment,"commentuserId":user?.uid,"commentuserName":user?.displayName}]);
        // console.log(commentList);
        setNewComment("");
    }

    return(
        <div>
            Comment: 
            {commentList?.map((comment:commentType)=>(
                <div>
                    <span>{comment.comment}</span>
                    <span>{comment.commentuserName}</span>
                </div>
            ))}
            <form onSubmit={handleSubmit(submitComment)}>
                <input type="text" value={newcomment} {...register("Title")}  onChange={(e)=>{setNewComment(e.target.value);}}></input>
                <p style={{color:"red"}}>{errors.Title?.message}</p>
                <input type="submit"></input>
            </form>
        </div>
    );
}