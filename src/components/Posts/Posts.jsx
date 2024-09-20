import { useState, useEffect, useRef } from "react";

export default function Posts({postId, setPostId}) {
    return (
        <>
            {postId
            ? 
            <PostDetail postId={postId} setPostId={setPostId} />
            : 
            <PostsLists postId={postId} setPostId={setPostId} /> 
            }
        </>
    )
}

function PostsLists({setPostId, postId}) {
    const [fetchData, setFetchData] = useState([]);
    const [newPost, setNewPost] = useState({});

    useEffect(() => {
        async function fetchData() {
            const response = await fetch("http://localhost:3000/api/posts");
            const data = await response.json();
            setFetchData(data);
        }

        fetchData();
    }, [newPost])

    async function addNewPosts(e) {
        e.preventDefault();
        const formObj = Object.fromEntries(new FormData(e.target));
        const response = await fetch("http://localhost:3000/api/posts", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(formObj)
        });

        if(!response.ok){ return; }
        
        const data = await response.json();
        setNewPost(data);
        e.target.reset();
    }

    return (
        <div className="posts">
            <form className="form-group" onSubmit={addNewPosts}>
                <div className="inputs">
                    <input required type="text" name="title" placeholder="Title..."/>
                    <input required type="text" name="content" placeholder="Content..."/>
                </div>
                <button>submit</button>
            </form> 

            {fetchData.reverse().map((x, i) =>
                <div className="postItem" key={i}>
                    <div className="postDetailButton">
                        <p>{x.createdAt}</p>
                        <button onClick={e => {e.preventDefault(); setPostId(x.id)}}>Show More</button>
                    </div>

                    <div className="postText">
                        <h2>{x.title}</h2>
                        <p>{x.content}</p>
                    </div>

                    <hr />
                    <div className="postLikesDislikes">
                        <small>{x.likes} likes {x.dislikes} dislikes</small>
                    </div>
                </div>
            )}
        </div>
    )
}

function PostDetail({setPostId, postId}) {
    const [post, setPost] = useState([]);
    const [newComment, setNewComment] = useState({});
    const [refresh, setRefresh] = useState(false);
    const [error, setError] = useState(null);
    const formRef = useRef(null);

    useEffect(() => {
        async function postData() {
            const response = await fetch(`http://localhost:3000/api/posts/${postId}`);
            const data = await response.json();
            setPost(data);
        }

        postData();
    }, [newComment, refresh])

    async function addNewComment(e) {
        e.preventDefault();
        const formObj = Object.fromEntries(new FormData(e.target));
        console.log(formObj);

        const newComment = {
            ...formObj,
            postId: postId
        }

        try{
            const response = await fetch("http://localhost:3000/api/comments", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(newComment)
            })
            if(response.ok){
                setNewComment(newComment);
                e.target.reset();
            }
        }catch(e){
            console.log(e);
            setError("bir hata oluştu");
        }
    }

    function handleClick(e) {
        e.preventDefault();
        setPostId(null);
    }

    async function handleLikeBtn(e) {
        e.preventDefault();
        const commentId = e.target.value;
        const response = await fetch(`http://localhost:3000/api/comments/${commentId}?like=true`);
        if (!response.ok) {
          return;
        }
        setRefresh(!refresh);
    }
    
    async function handleDisLikeBtn(e) {
        e.preventDefault();
        const commentId = e.target.value;
        const response = await fetch(`http://localhost:3000/api/comments/${commentId}?dislike=false`);
        if (!response.ok) {
          return;
        }
        setRefresh(!refresh);
    }

return (
        <div className="postDetail">
            <div className="detailTexts">
                <div className="detailTitle">
                    <h1>{post.title}</h1>
                    <button onClick={handleClick}>return to posts</button>
                </div>

                <p>{post.content}</p>
                <hr />
                <small>{post.likes} likes {post.dislikes} dislikes</small>
            </div>

            <div className="commentSection">
                <form className="addNewComment" onSubmit={addNewComment}>
                    <input required type="text" name="content" placeholder="Add Comments..."/>
                    <button>submit</button>
                </form>

                <div className="comments">
                    {post.comments?.map((x, i) => 
                        <div className="comment" key={i}>
                            <p> {x.content} </p>

                            <div className="likeDislike">
                                <button onClick={handleLikeBtn} value={x.id}>
                                    <img src="public/assets/images/like.png" alt="" /> 
                                    {x.likes}
                                </button>
                                
                                <button onClick={handleDisLikeBtn} value={x.id}>
                                    <img src="public/assets/images/dislike.png" alt="" /> 
                                    {x.dislikes}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}