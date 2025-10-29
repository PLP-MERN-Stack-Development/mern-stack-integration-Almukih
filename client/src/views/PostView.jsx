import React, {useEffect, useState, useContext} from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../auth';

export default function PostView(){
  const { id } = useParams();
  const [post,setPost]=useState(null);
  const [loading,setLoading]=useState(true);
  const { user } = useContext(AuthContext);
  useEffect(()=>{
    api.get('/posts/'+id).then(r=>{ setPost(r.data); setLoading(false); }).catch(()=>setLoading(false));
  },[id]);
  if(loading) return <div>Loading...</div>;
  if(!post) return <div>Not found</div>;

  async function handleDelete(){
    if(!confirm('Delete this post?')) return;
    await api.delete('/posts/'+id);
    window.location.href = '/';
  }

  return (
    <div>
      <h2>{post.title}</h2>
      {post.featuredImage && <img src={post.featuredImage} alt="featured" />}
      <p>{post.content}</p>
      <p>Views: {post.viewCount}</p>
      <p>Author: {post.author?.username || '—'}</p>
      {user && user.id === post.author?.id && (<div><Link to={'/edit/'+post._id}>Edit</Link> | <button onClick={handleDelete}>Delete</button></div>)}
    </div>
  );
}
