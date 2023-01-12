import { doc, deleteDoc } from "firebase/firestore";
import { db, storage } from "../config/firebase";
import {  ref, deleteObject } from "firebase/storage";
import { useContext } from 'react';
import { Homecontext } from '../pages/Home';

interface deleteProps{
    postId:string,
    imageUrl:string,
}

export const DeletePost = (props:deleteProps) => {

    const postData = useContext(Homecontext);

    const deletePost = async () => {

        const deleteRef = ref(storage, props.imageUrl);
        // Delete the file
        await deleteObject(deleteRef).then(() => {
            console.log("post image deletd in storage")
        }).catch((error) => {
            console.log("deletpost  "+error);
        });
        await deleteDoc(doc(db, "posts", props.postId));
        console.log("Document deleted successfully");

        const newPostList = postData?.postList?.filter(post => post.id != props.postId)
        postData?.setPostList(newPostList);
    }
    return (
        <button onClick={deletePost} className="follow">Delete post</button>
    )
}