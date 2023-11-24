//rozszerzenie rfce tworzy nam od razu komponenty react
import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import ModeCommentOutlined from '@mui/icons-material/ModeCommentOutlined';
import IconButton from '@mui/joy/IconButton';
import SendOutlined from '@mui/icons-material/SendOutlined';

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] =useState([]);
  const[comments, setComments] = useState([]);//lista komentarzy,funkcja
  const [newcomment, setNewComment] =useState('')//string - treść komentarza który wpisujemy
  const history = useNavigate();

  useEffect(() => {

    //sprawdzamy czy użytkownik jest zalogowany, jeśli nie to na stronę logowania
    if (!localStorage.getItem("accessToken")){
      history("/login");
    }else{
   
    axios.get("http://localhost:3001/posts",  {headers: { accessToken: localStorage.getItem("accessToken")}}).then((response) => {
      setListOfPosts(response.data.listOfPosts);
      setLikedPosts(response.data.likedPosts.map((like)=> {return like.PostId;}));
    });
    axios.get("http://localhost:3001/auth/login").then((response) => {
      setListOfPosts(response.data.listOfPosts);});
    
  }
  }, []);

//funkcja polubienia postu  
const likeAPost = (postId) => {
  axios.post("http://localhost:3001/likes",
      { PostId: postId },
      { headers: { accessToken: localStorage.getItem("accessToken") } }
    )
    .then((response) => {
      setListOfPosts(
        listOfPosts.map((post) => {
          //chcemy zmienić jeden konkretny post
          if (post.id === postId) {
            //gdy polubiono
            if (response.data.liked) {
              //zmienimay tylko tablice Likes dodoając do niej 1 element o długości 1
              return { ...post, Likes: [...post.Likes, 0] };
            } else {
              const likesArray = post.Likes;
              likesArray.pop(); //usuwamy ostatni element
              return { ...post, Likes: likesArray };
            }
          } else {
            return post;
          }
        })
      );

      //automatyczna zmiana, bez potrzeby odświeżania strony
      if (likedPosts.includes(postId)){ //szukamy id postu który właśnie unlike
        setLikedPosts(likedPosts.filter((id) => {
          return id !== postId;}));
      } else { //dodajemy post do tablicy z polubionymi
        setLikedPosts([...likedPosts, postId])
      }
    });
};

//map indeks w tablicy i zawartosc
//zwraca nam w osobnym elemencie tytuł postu
  return (
    <div>
      {listOfPosts.map((value, key) => {
        return (
          //post - reprezentuje jedno okienko
          <div key={key} className="post">
            <div className="gora"> 
            <Avatar size="sm"
            src="/static/logo.png"
            sx={{ p: 0.5, border: '2px solid', borderColor: 'background.body'}}
            onClick={() => history(`/profile/${value.UserId}`)}
            />
            <div className="usernamee"> <Link to={`/profile/${value.UserId}`}>{value.username}</Link></div>
          </div>
          <div className="body" onClick={() => history(`/post/${value.id}`)}>     <img src={value.postText} alt="obrazek" width="500" height="500"/></div>
          <div className="footer">
            <div className="buttons">
              <Box sx={{ width: 0, display: 'flex', gap: 0.5 }}>
                <IconButton variant="plain" color="gray" size="sm">
                <FavoriteBorderIcon onClick={() => {likeAPost(value.id);}} className={likedPosts.includes(value.id) ? "likebutton1" : "unlikebutton"}/>
                </IconButton>
                <IconButton variant="plain" color="gray" size="sm">
                <ModeCommentOutlined className="comment" onClick={() => {history(`/post/${value.id}`);}}/>
                </IconButton>
                <IconButton variant="plain" color="gray" size="sm">
                <SendOutlined />
                </IconButton>
              </Box>
            </div>
          <div className="polubienia"> Liczba polubień {value.Likes.length}</div>
          <div className="title"> {value.title} </div>
              
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;