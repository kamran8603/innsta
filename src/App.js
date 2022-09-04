import React, { useEffect, useState } from 'react';
import './App.css';
import Post from './Post';
import { db } from './firebase';
import  {Button, Input, makeStyles}  from '@material-ui/core';
import  Modal  from '@material-ui/core/Modal';
import { auth } from './firebase';
import ImageUpload from './ImageUpload';
import InstagramEmbed from  'react-instagram-embed';


function getModalStyle(){
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top})%, -${left}%`, 
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}) );

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, SetPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [OpenSignIn, setOpenSignIn] = useState(false);

  
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);


    useEffect(() => {
   const unsubscribe = auth.onAuthStateChanged((authUser) => {
    if(authUser){
//if user is logged in
    console.log(authUser)
    setUser(authUser);

 
      } else { 
    //user has logged out
      setUser(null);
      }
     })
     return () => {
      unsubscribe();
     }
       },[user, username]);




  useEffect(() => {
db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
  //every times a new post is added, this code fires...
  SetPosts(snapshot.docs.map(doc => ({
    id: doc.id,
     post:doc.data()
    })));
})
  }, []);

  //this is user authentication
 
  const SignUp = (event) => {
   event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
     return authUser.user.updateProfile({
        displayName: username
      })
    })

    .catch((error) => alert(error.message) )
    setOpen(false);
  }


  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .catch((error) =>(error.message))
    setOpenSignIn(false);

  }

  return (
    <div className="app">

     
      

      {/*i want to have */}
      {/*  caption input */}
      {/* file picker*/}
      {/* post button*/}


      <Modal
        open={open}
        onClose={() => setOpen(false) }
        >
          <div style={modalStyle} className={classes.paper}>

            <form className='app__signup' >

            <center>
            <img
            className='app__headerImage'
            src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
            alt=''
            />
            </center>

            <Input
            placeholder='username'
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value) }
            />

            <Input
            placeholder='email'
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value) }
            />
            
            <Input 
            placeholder='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value) }
            />
            <Button type='submit' onClick={SignUp}>Sign Up</Button>
           </form>
           </div>
          
          </Modal>
        

          <Modal
        open={OpenSignIn}
        onClose={() => setOpenSignIn(false) }
        >
          <div style={modalStyle} className={classes.paper}>

            <form className='app__signup' >

            <center>
            <img
            className='app__headerImage'
            src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
            alt=''
            />
            </center>

           

            <Input
            placeholder='email'
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value) }
            />
            
            <Input 
            placeholder='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value) }
            />
            <Button type='submit' onClick={signIn}>Sign In</Button>
           



            </form>
           
          </div>
          
          </Modal>






     <div className="app__header">
     <img 
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                
                alt=""
              />
        
        {user ? (
        <Button onClick={() => auth.signOut()}>Logout</Button>
      ): (
         <div className='app__loginContainer'>
          <Button onClick={() => setOpenSignIn(true) }>Sign In</Button>
          <Button onClick={() => setOpen(true) }>Sign Up</Button>
         </div>
        )
      }



      </div>

      <div className='app__posts'>
        <div className='app__postsLeft'>
        {
         posts.map( ({id,post}) => (
         <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
       ))
     }
        </div>

        <div className='app__postsRight'>

        <InstagramEmbed 
      url='https://www.instagram.com/p/B_uf9dmAGPw/'
      maxWidth={320}
      hideCaption={false}
      protocol=""
      injectScript
      onLoading={() => {}}
      onSuccess={() => {}}
      onAfterRender={() => {}}
      onFailure={() => {}}
      />

        </div>

      

      

      </div>


     

    

      
    
        
        {user?.displayName ? (
      <ImageUpload username={user.displayName} />

     ):(
      <h3>Sorry you need to login to upload</h3>
     )}



   </div>
  );
}

export default App;
