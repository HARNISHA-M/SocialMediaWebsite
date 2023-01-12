import { useContext } from "react";
import { Appcontext } from "../App";
import { ShowProfile } from "./showProfile";

export const Followers = () => {

    const followingData = useContext(Appcontext);

    return(

        <div>
            {followingData?.FollowersList?.map((element)=>(
                <div className="followersDetails">
                    <ShowProfile postUserId={element.userId}></ShowProfile>
                    <p>{element.userName}</p>
                </div>
            ))}
        </div>
    )
}