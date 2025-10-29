import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../auth';

export default function Login(){
  const { setUser, setToken } = useContext(AuthContext);
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  async function submit(e){
    e.preventDefault();
    try{
      const res = await api.post('/auth/login', { username, password });
      setToken(res.data.token);
      setUser(res.data.user);
      setError('');
      window.location.href = '/';
    }catch(err){
      setError(err.response?.data?.message || 'Login failed');
    }
  }
  return (<form onSubmit={submit}><h3>Login</h3>{error && <div style={{color:'red'}}>{error}</div>}<div><input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" required/></div><div><input value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password" required/></div><button type="submit">Login</button></form>);
}
