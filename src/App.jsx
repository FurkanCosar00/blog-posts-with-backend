import './App.css'
import Header from './components/Header/Header.jsx'
import Banner from './components/Banner/Banner.jsx'
import Posts from './components/Posts/Posts.jsx'
import { useState } from 'react';

function App() {
  const [postId, setPostId] = useState();

  return (
    <>
      {postId
        ? 
        <div className="container">
          <Header />
          <Posts postId={postId} setPostId={setPostId}/>
        </div>
        :
        <div className="container">
          <Header />
          <Banner/>
          <Posts postId={postId} setPostId={setPostId}/>
        </div>
      }
    </>
  )
}

export default App
