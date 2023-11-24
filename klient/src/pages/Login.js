import React, { useContext, useState } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import {AuthContext} from "../helpers/AuthContext"

function Login() {
  //pobranie danych z inputu który wpisujemy
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //pobieramy stan z AuthContext
  const {setAuthState} = useContext(AuthContext);

  let history = useNavigate();

  const login = () => {
    const data = { username: username, password: password };
    axios.post("http://localhost:3001/auth/login", data).then((response) => {
      //console.log(response.data);
      if(response.data.error) {
        alert(response.data.error);
      }else{
        localStorage.setItem("accessToken", response.data.token);
        setAuthState({username: response.data.username,  id: response.data.id, status: true}); //gdy się logujemy, zmieniamy stan na true
        history("/"); //przeniesienie na stronę głowną po zalogowaniu
      }
    });
  };

  return (
    <div className="loginContainer">
      <label>Login:</label>
      <input
        placeholder="Wprowadz login..."
        type="text"
        onChange={(event) => { setUsername(event.target.value); }}
      />
      <label>Hasło:</label>
      <input
        placeholder="Wprowadz hasło..."
        type="password"
        onChange={(event) => { setPassword(event.target.value); }}
      />

      <button className="loginbutton" onClick={login}> Zaloguj się </button>
    </div>
  );
}

export default Login;