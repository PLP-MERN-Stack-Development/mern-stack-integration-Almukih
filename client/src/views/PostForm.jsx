import React, {useState, useEffect, useContext} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../auth';

export default function PostForm(){
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [title,setTitle]=useState('');
  const [content,setContent]=useState('');
  const [featuredImage,setFeaturedImage]=useState('');
  const [category,setCategory]=useState('');
  const [categories,setCategories]=useState([]);

  useEffect(()=>{
    api.get('/categories').then(r=>setCategories(r.data)).catch(()=>{});
    if(id){
      api.get('/posts/'+id).then(r=>{ setTitle(r.data.title); setContent(r.data.content); setFeaturedImage(r.data.featuredImage || ''); setCategory(r.data.category?.name || ''); }).catch(()=>{});
    }
  },[id]);

  async function uploadFile(file){
    const fd = new FormData();
    fd.append('file', file);
    const res = await api.post('/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data.path;
  }

  async function submit(e){
    e.preventDefault();
    let img = featuredImage;
    if (img instanceof File) {
      img = await uploadFile(img);
    }
    if(id){
      await api.put('/posts/'+id,{ title, content, category, featuredImage: img });
    } else {
      await api.post('/posts',{ title, content, category, featuredImage: img });
    }
    navigate('/');
  }

  return (
    <form onSubmit={submit}>
      <h3>{id ? 'Edit' : 'Create'} Post</h3>
      <div><label>Title</label><br/><input value={title} onChange={e=>setTitle(e.target.value)} required/></div>
      <div><label>Category</label><br/>
        <select value={category} onChange={e=>setCategory(e.target.value)}>
          <option value="">-- select --</option>
          {categories.map(c=> <option key={c._id} value={c.name}>{c.name}</option>)}
        </select>
      </div>
      <div><label>Featured Image</label><br/>
        <input type="file" onChange={e=>setFeaturedImage(e.target.files[0])} />
        {typeof featuredImage === 'string' && featuredImage && (<div><img src={featuredImage} alt="" style={{maxWidth:200}}/></div>)}
      </div>
      <div><label>Content</label><br/><textarea value={content} onChange={e=>setContent(e.target.value)} rows={10} required/></div>
      <button type="submit">Save</button>
    </form>
  );
}
