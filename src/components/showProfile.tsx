import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import {auth, storage} from "../config/firebase";

export const ShowProfile = (props:any) => {

    const[profile,setProfile]=useState<string| null>(null);

    const showpostProfile = async () => {
        if(props.postUserId.length < 2) return;
            
            const imageRef = ref(storage,"Profile/"+props.postUserId);
             
            await getDownloadURL(imageRef).then((url)=>{
                setProfile(url);
            }).catch((e)=>{console.log("dsd")});
        
        
    }

    useEffect(()=>{
        showpostProfile();
    },[props.postUserId]);

    return(
        <div>
            <img className="profile"
            src={profile != null && profile.length > 5 ? profile : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"} width="50px" height="50px"></img> 
        </div>
    )
}