import React, {useState, useEffect} from "react";
import Post from "./Post";
import { fetchUserPosts } from "../services/posts";

const ProfilePosts = () => {
    const [posts, setPosts] = useState([])

    useEffect(() => {
    const fetchAllUserPosts = async () => {
        const fetchedPosts = await fetchUserPosts()
        if(fetchedPosts) {
            console.log(fetchedPosts)
            setPosts(fetchedPosts)
        }
    }

    fetchAllUserPosts()
    }, [])

    return (
        <div>
            <h1>Profile Posts</h1>
            <ul>
        {posts && posts.map(post => <Post key={post.post_id} post={post} />)}
      </ul>
        </div>
    )
}

export default ProfilePosts