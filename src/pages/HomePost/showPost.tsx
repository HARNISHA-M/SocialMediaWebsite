import {PostType} from './Home'
interface propType {
    post:PostType;
}
export const ShowPost = (props:propType) => {
    const {post} = props;
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
        </div>
    )
}