import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../config/firebase';
import {useForm} from "react-hook-form";
import { doc, updateDoc } from 'firebase/firestore';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import '../styles/post.css'
import { ShowProfile } from './showProfile';

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
    const [commentList,setCommentList] = useState<commentType[]|any>();

    // submiting comment
    const submitComment = async(e:any) => {
        await updateDoc(docRef,{comments:[...commentList,{"comment":newcomment,"commentuserId":user?.uid,"commentuserName":user?.displayName}]});
        setCommentList([...commentList,{"comment":newcomment,"commentuserId":user?.uid,"commentuserName":user?.displayName}]);
        setNewComment("");
    }

    const [isVisible,setIsVisible] = useState<Boolean>();

    useEffect(()=>{
        setCommentList(props.postComments);
        setIsVisible(false);
        console.log(isVisible);
    },[]);

    return(
        <div>
            <hr></hr>
            <form onSubmit={handleSubmit(submitComment)}>
                <div className="comment">
                    <input type="text" placeholder="Add your comment" value={newcomment} {...register("Title")}  onChange={(e)=>{setNewComment(e.target.value);}}></input>
                    <button className='commentButton'><i className="fa-sharp fa-solid fa-paper-plane"></i></button>
                    <p style={{color:"red"}}>{errors.Title?.message}</p>
                </div>
            </form>
            {commentList?.length > 0 &&  <>
                <a onClick={() => {setIsVisible(!isVisible)}}>View more comments ( {commentList?.length} )</a>
                {commentList && 
                    commentList?.map((comment:commentType)=>(
                        <div className={isVisible ? "visible" : "hide"}>
                            <ShowProfile postUserId={comment.commentuserId}></ShowProfile>
                            <div>
                                <span>
                                    {comment.commentuserName.split(" ")[0]}
                                    <span className="comments"> {comment.comment}</span>
                                </span>
                            </div>
                            
                        </div>
                    ))}
                </>
            }
        </div>
    );
}
