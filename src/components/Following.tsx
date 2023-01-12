import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
 import { useContext } from "react";
import { Appcontext } from "../App";
import { useAuthState } from "react-firebase-hooks/auth";
import  { followingType } from '../App'

export const Following  = (props:followingType) => {

    const followingData = useContext(Appcontext);
    const [user] = useAuthState(auth);

    const [isFollowing,setIsFollowing] = useState<boolean|null>(null);
    
    const userDetailsRef = doc(db, "userDetails", props.userId);

    const followingState =async () => {

        if(followingData?.FollowingList)
        {
            console.log(props.userName);
            const filtered = followingData?.FollowingList.filter(value=> value.userId==props.userId);
            if(filtered.length!=0) setIsFollowing(true);
            else setIsFollowing(false);
            console.log("isFollowing");
            console.log(isFollowing);
        }
    }

    const addFollowingId = async() => {

        if(followingData?.FollowingList)
        {
            user?.uid && await setDoc(doc(db,"userDetails",user?.uid),
            {
                following : [...followingData.FollowingList,{userId:props.userId,userName:props.userName}],
                followers : followingData.FollowersList
            });
            followingData.FollowingList = [...followingData.FollowingList,{userId:props.userId,userName:props.userName}];
            await followingData.setFollowingList(followingData.FollowingList);
            followingState();
            console.log("Addfollow");
            console.log(followingData.FollowingList);
        }

        const dataReceived = await getDoc(userDetailsRef);
        if(dataReceived.exists())
        {
            await updateDoc(userDetailsRef, {
                followers : [...dataReceived?.data()?.followers,{userId:user?.uid,userName:user?.displayName}]
            });
        }
        else
        {
            await setDoc(userDetailsRef,
            {
                following : [],
                followers : [{userId:user?.uid,userName:user?.displayName}],
            });
        }
        console.log("Followers added for post user");
    }

    const removeFollowingId = async() => {
     
        if(followingData?.FollowingList)
        {
            const newList = followingData.FollowingList.filter(user => user.userId != props.userId);
            console.log(newList);
            user?.uid && await setDoc(doc(db,"userDetails",user?.uid),
            {
                following : newList,
                followers : followingData.FollowersList
            });
            await followingData.setFollowingList(newList);
            followingState();   
            console.log("removefollow")
            console.log(followingData.FollowingList);

        }
        const dataReceived = await getDoc(userDetailsRef);
        await updateDoc(userDetailsRef, {
            followers : [...dataReceived?.data()?.followers.filter((obj:any) => obj.userId != user?.uid)]
        });
        console.log("Followers updated for post user");
    }

    useEffect(()=>{
        followingState();
    },[user?.uid,followingData?.FollowingList])

    return (
        <div>
            {isFollowing===true && <button onClick={removeFollowingId} className="follow">unFollow</button>}
            {isFollowing===false && <button onClick={addFollowingId} className="follow">Follow</button>}
        </div>
    )
}