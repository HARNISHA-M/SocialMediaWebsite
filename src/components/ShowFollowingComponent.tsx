import { useContext } from "react";
import { Appcontext } from "../App";
import { Following } from "./Following";
import { ShowProfile } from "./showProfile";

export const ShowFollowingComponent = () => {

    const followingData = useContext(Appcontext)

    return(

        <div>
            {followingData?.FollowingList?.map((element)=>(
                <div className="followingDetails">
                    <div>
                        <ShowProfile postUserId={element.userId}></ShowProfile>
                        <p>{element.userName}</p>
                    </div>
                    <Following userId = {element.userId}  userName = {element.userName}></Following>
                </div>
            ))}
        </div>
    )
}