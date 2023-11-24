import './App.css';
import {BrowserRouter as Router, Route, Routes, Link} from "react-router-dom"
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Registration from "./pages/Registration";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";

import {AuthContext} from './helpers/AuthContext';
import{useState, useEffect} from 'react';
import axios from 'axios';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function App() {
//decinicje routes  

//stara wersja
// "/"to dco się wyświetlana stronie głownej, tylko jedna routes, co ma się wyświetlić
//<Route path="/" exact component={Home}/>
//Switch -> Routes - mowi aby wyświetlić pierwszy komponent pasujący do ścieżki
//Link na górze (po Router) bedzie istnieć na każdej stronie

//stan sprawdzanie czy i kto jesteśmy zalogowani, domyślnie nie
const [authState, setAuthState] = useState({
  username: "",
  id: 0, 
  status:false,
});

//funkcja uruchaniana po otworzeniu strony
//zapytanie do endpoint z Users, jeśli middlewares nie rozpozmnaje użytkownika to zwraca błąd
useEffect(()=>{
  axios.get('http://localhost:3001/auth/auth', {headers: {accessToken: localStorage.getItem("accessToken"),
  },
  }).then((response)=>{
    if(response.data.error) {setAuthState({...setAuthState, status:false})} //...destructure object
    else{setAuthState({
      username: response.data.username,
      id: response.data.id, 
      status:true,
    });}
  })
    
  },[]);

//wylogowanie
const logout = () => {
  localStorage.removeItem("accessToken");
  setAuthState({ username: "", id: 0, status: false });
};

// AuthContext wszystkie elementy strony wewnątrz beda miały dostęd do zmiennych [authState, setAuthState] przekazywanego w AuthContext
return (
    <div className="App">
      <AuthContext.Provider value={{authState, setAuthState}}>
      <Router>
        <div className="navbar">
          
          <div className="links">
            {!authState.status ? (
            <>
            <div className = "logo"></div><div className="logo2"></div><div className="logo3"></div>
              <Link to='/login'>Zaloguj się</Link> 
              <Link to='/registration'>Zarejestruj się</Link> 
            </>
            ) : (
            <>
              <Link to='/'> <div className = "logo11"></div><div className="logo22"></div><div className="logo33"></div> </Link> 
              <Link to='/createpost'>Utwórz post</Link> 
            </>
            )}
            <div className="loggedInContainer">      
              <h2>{authState.username} </h2>       
              {authState.status &&  <AccountCircleIcon  className="awatar"  onClick={() => navigate(`/profile/${authState.status}`)} />}
              {authState.status &&  <button onClick={logout}> Wyloguj się </button>}
            </div>
          </div>
          </div> 

        <Routes>
          <Route path="/" element={<Home />} exact></Route>
          <Route path="/createpost" element={<CreatePost />} exact></Route>
          <Route path="/post/:id" element={<Post />} exact></Route>
          <Route path="/registration" element={<Registration />} exact></Route>
          <Route path="/login" element={<Login />} exact></Route>
          <Route path="/profile/:id" element={<Profile />} exact></Route>
          <Route path="/changepassword" element={<ChangePassword />} exact></Route>
          <Route path="*" element={<PageNotFound />} exact></Route>
        </Routes>
      </Router>
      </AuthContext.Provider>
    </div>
    );

}

export default App;
