import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import {db, auth} from './firebase';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';




function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
const classes = useStyles();
const [modalStyle] = useState(getModalStyle);

const [posts, setPosts] = useState([]);
const [open, setOpen] = useState(false);
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [email, setEmail] = useState('');
const [user, setUser] = useState(null);
const [openSignIn, setOpenSignIn] = useState(false);


useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in
        console.log(authUser);
        setUser(authUser);
      }else {
        //use has logged out
        setUser(null);
      }
    })

    return () => {
      //perform some cleanup activities
      unsubscribe();
    }
}, [user, username]);
  /*const [posts, setPosts] = useState([
    {
      username: 'Stark ',
      caption: 'Mark LXIVV Avengers: Endgame',
      imageUrl: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2020/06/Tony-Starks-Iron-Man-Mark-LXXXV-Armor-In-Avengers-Endgame.jpg?q=50&fit=crop&w=740&h=370&dpr=1.5'
    },
    {
      username: 'Tony ',
      caption: 'I am IronMan',
      imageUrl: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2020/06/Tony-Starks-Iron-Man-Mark-LXXXV-Armor-In-Avengers-Endgame.jpg?q=50&fit=crop&w=740&h=370&dpr=1.5'
    },
  ]);*/

useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      //everytime a new post is added, this code fires
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
}, []);

const signUp = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username,
      })
    })
    .catch((error) => alert(error.message));

    setOpen(false);
}

const signIn = (event) => {
  event.preventDefault();

  auth.signInWithEmailAndPassword(email, password)
  .catch((error) => alert(error.message))

  setOpenSignIn(false);
}

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
         >
            <div style={modalStyle} className={classes.paper}>
              <form className='app_signup'>
              <center>
                <img
                  className='app_headerImage'
                  src={'https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'}
                  alt=""
                />
              </center>
              <Input
                  placeholder='username'
                  type='text'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  placeholder='email'
                  type='text'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button type='submit' onClick={signUp}>Sign Up</Button>
                </form>
            </div>
      </Modal>

      {/*sign in, the first modal above is sign up*/}
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
         >
            <div style={modalStyle} className={classes.paper}>
              <form className='app_signup'>
              <center>
                <img
                  className='app_headerImage'
                  src={'https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'}
                  alt=""
                />
              </center>
                <Input
                  placeholder='email'
                  type='text'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button type='submit' onClick={signIn}>Sign In</Button>
                </form>
            </div>
      </Modal>
      {/**Header */}
      <div className='app_header'>
        <img
            className='app_headerImage'
            src={'https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'}
            alt=""
          />

          {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
          ):(
            <div className='app_loginContainer'>
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>     
          )}  
      </div>

      <div className='app_posts'>
        <div className='app_postsLeft'>
            {/**Post */}
            {
              posts.map(({id, post}) => (
                <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
              ))
            }
        </div>
        <div className='app_postsRight'>
            <InstagramEmbed
              url='https://www.instagram.com/p/CPoZhWegC6E/'
              
              maxWidth={320}
              hideCaption={false}
              containerTagName='div'
              protocol=''
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}
            />

            <center>
                <img
                  className='app_headerImage'
                  src={'https://static1.srcdn.com/wordpress/wp-content/uploads/2020/06/Tony-Starks-Iron-Man-Mark-LXXXV-Armor-In-Avengers-Endgame.jpg?q=50&fit=crop&w=740&h=370&dpr=1.5'}
                  alt=""
                />
            </center>
          </div>
      </div>

      {/**optional user?.displayName */}
      {user?.displayName ? (
          <ImageUpload username={user.displayName}/>
      ):(
          <h3>Sorry you need to login to upload</h3>
      )}

 

    </div>
  );
}

export default App;
