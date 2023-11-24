import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {AuthContext} from "../helpers/AuthContext";
import Avatar from '@mui/joy/Avatar';

function Profile() {
  let { id } = useParams(); //pobieramy id z linku
  let history = useNavigate();
  const [username, setUsername] = useState(""); //użytkownik na kogo profil wchodzimy
  const [listOfPosts, setListOfPosts] = useState([]);

  //pobieramy authState czyli który użytkownik jest zalogowany
  const {authState} = useContext(AuthContext);

  //uruchomione raz przy włączeniu strony profilu
  useEffect(() => {
    //request to query to build the page -> info about user
    axios.get(`http://localhost:3001/auth/basicinfo/${id}`).then((response) => {
      setUsername(response.data.username);
    });
    //users posts
    axios.get(`http://localhost:3001/posts/byuserId/${id}`).then((response) => {
      setListOfPosts(response.data);
    });
  }, []);

  return (
    <div className="profilePageContainer">
      <div className="basicInfo">
        {" "}
        <Avatar size="sm"
            src="/static/logo.png"
            sx={{ p: 0.5, border: '2px solid', borderColor: 'background.body'}}/>
        <h1>  {username} </h1>
      
        <div> {authState.username === username && (<button onClick={() => {history("/changepassword"); }}> {" "} Change My Password </button> )} </div>
      </div>
      <div className="listOfPosts">
        {listOfPosts.map((value, key) => {
          return (
            <div key={key} className="post_profile">
              <div className="body" onClick={() => {history(`/post/${value.id}`);}}><img src={value.postText} alt="obrazek" width="250" height="250"/></div> 
              <div className="title"> {value.title} </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Profile;