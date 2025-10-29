import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
export default function PostList(){
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  useEffect(()=> { fetchPage(1); }, []);
  async function fetchPage(p){
    const res = await api.get('/posts', { params: { page: p, limit: 5, search } });
    setPosts(res.data.posts);
    setPage(res.data.page);
    setTotalPages(res.data.pages);
  }
  return (
    <div>
      <h2>Posts</h2>
      <div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." />
        <button onClick={()=>fetchPage(1)}>Search</button>
      </div>
      {posts.map(post=>(
        <div key={post._id} style={{border:'1px solid #ddd', padding:10, marginBottom:10}}>
          <h3><Link to={'/posts/'+post._id}>{post.title}</Link></h3>
          {post.featuredImage && <img src={post.featuredImage} alt="" style={{maxWidth:200}}/>}
          <p>{post.content.slice(0,200)}...</p>
          <p><small>Category: {post.category?.name || '—'} | Author: {post.author?.username || '—'}</small></p>
        </div>
      ))}
      <div>
        <button onClick={()=>fetchPage(Math.max(1,page-1))} disabled={page<=1}>Prev</button>
        <span style={{margin:'0 10px'}}>Page {page} / {totalPages}</span>
        <button onClick={()=>fetchPage(Math.min(totalPages,page+1))} disabled={page>=totalPages}>Next</button>
      </div>
    </div>
  );
}
