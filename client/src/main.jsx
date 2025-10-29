import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PostList from './views/PostList';
import PostView from './views/PostView';
import PostForm from './views/PostForm';
import Login from './views/Login';
import Register from './views/Register';
import './index.css';
import { AuthProvider } from './auth';

function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{padding:20}}>
          <nav style={{marginBottom:20}}>
            <Link to="/">Home</Link> | <Link to="/create">Create Post</Link> | <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
          </nav>
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts/:id" element={<PostView />} />
            <Route path="/create" element={<PostForm />} />
            <Route path="/edit/:id" element={<PostForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

createRoot(document.getElementById('root')).render(<App />);
