import React, { useEffect, useState, useContext} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {AuthContext} from "../helpers/AuthContext";
import Avatar from '@mui/joy/Avatar';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const[comments, setComments] = useState([]);//lista komentarzy,funkcja
  const [newcomment, setNewComment] =useState('')//string - tresc komentarza który wpisujemy

  //pobieramy authState czyli który użytkownik jest zalogowany
  const {authState} = useContext(AuthContext);

  let history = useNavigate();

  //gdy strona się wczytuje
  useEffect(() => {
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  },[]); //dependency array - dzieki temu nie będziemy wyywływać zapytania co sekundę

//dodanie komentarza na podstawie input który wprowadza użytkownik
  const addComment = () =>{                       //tresc i do ktoreg postu dodajemy
    axios.post(`http://localhost:3001/comments`, 
    {commentBody:newcomment,  PostId:id },
    { headers: { accessToken: localStorage.getItem("accessToken"),  }, }
    ).then((response)=>{
      if(response.data.error){
        //alert(response.data.error);
        console.log(response.data.error);
      }else{
      //console.log("Komentarz dodany")
      //po napisaniu komentarza musimy wyslac go do listy komentarzy const[comments, setComments] 
      //mamy poprzednie el tablicy, i dodajemy nowy
      const commentToAdd = {commentBody: newcomment, username: response.data.username}
      setComments([...comments, commentToAdd ]);
      setNewComment(""); //pusty sting, aby po wysłaniu nie zostawał
  }});
  };

//funkcja do usuwania komentarza
const deleteComment = (id) => {
  axios
    .delete(`http://localhost:3001/comments/${id}`, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    })
    .then(() => {
      //dla listy comments każdy element ma value
      //zatrzymujemy te komentarz które nie mają id które chcemy usunać
      setComments(
        comments.filter((val) => {
          return val.id !== id;
        })
      );
    });
};


//usunięcie postu
const deletePost = (id) => {
  axios
    .delete(`http://localhost:3001/posts/${id}`, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    })
    .then(() => {
      alert("Poprawnie usunięto post");
      history("/");
    });
};

//edycja postu: tytułu / treśli w zalezności od przeazanej opcji
const editPost = (option) => {
  if (option === "title") {
    let newTitle = prompt("Wpisz nowy tytuł:");
    axios.put(
      "http://localhost:3001/posts/title",
      { newTitle: newTitle, id: id, }, //body
      {headers: { accessToken: localStorage.getItem("accessToken") },} //headers
    );

    //dla automatycznej zmiany bez odświeżania strony, zminiamy tylko tytuł z obiektu
    setPostObject({ ...postObject, title: newTitle });
  } else {
    let newPostText = prompt("Wpisz tekst postu:");
    axios.put(
      "http://localhost:3001/posts/postText",
      {newText: newPostText, id: id, },
      { headers: { accessToken: localStorage.getItem("accessToken") }, }
    );
    //zminiamy tylko treść postu z obiektu
    setPostObject({ ...postObject, postText: newPostText });
  }
};


  //wyświetli na stonie, parametr którego użyliśmy w linku
  //nastepnie na podstawie tego linku chcemy wyświetli dane z bazy
  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div className="footer">
          <Avatar size="sm"
            src="/static/logo.png"
            sx={{ p: 0.5, border: '2px solid', borderColor: 'background.body'}}
          />
            <div className="nazwa">{postObject.username}</div>
            {authState.username === postObject.username && (
              <button onClick={() => { deletePost(postObject.id); }}
              > {" "} Usuń Post </button>
            )}
            </div>
        
          <div className="body" onClick={() => { if (authState.username === postObject.username) {editPost("body");}}}><img src={postObject.postText} alt="obrazek" width="500" height="500"/></div>
          <div className="title" onClick={() => {if (authState.username === postObject.username) {editPost("title"); }}}>{postObject.title}</div>
      </div>
    </div>
      <div className="rightSide">
        <div className="listOfComments">
          {comments.map((comment, key)=>{
             return <div key={key} className="comment"> <AccountCircleIcon/> <label className="nazwa_uzytkownika"> {comment.username} </label> {comment.commentBody} 
             
             
             
             {authState.username === comment.username && (
                  <button onClick={() => {deleteComment(comment.id);}}>
                    Usuń Komentarz </button>
                )}
             </div>
          })}
        </div>
        <div className="addCommentContainer">
          <SentimentSatisfiedAltIcon/>
          <input type="text" value={newcomment} placeholder="Wprowadz komentarz..." onChange={(event)=> {setNewComment(event.target.value)}}></input> 
          <button onClick={addComment}>Opublikuj</button>
        </div>
      </div>

    </div>
  );
}

//button porównujemy zalogowanego użytkownika z autorem komentarza aby wyświetlić przycisk do usunięcia
//usuwanie poprez wybranie konkretnego id komentarza

//input
//przy onChange event - pobierane wartości i zmiana ich stanu
//value=newcomment aby potem mogl zniknac i się odświerzyć

export default Post;
