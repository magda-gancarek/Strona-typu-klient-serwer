import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  let history = useNavigate();

  const changePassword = () => {
    axios.put("http://localhost:3001/auth/changepassword",
        {oldPassword: oldPassword, newPassword: newPassword, }, //body
        { headers: { accessToken: localStorage.getItem("accessToken"), }, }
      )
      .then((response) => { //jeśli był jakiś bład w request to był problem z zmianą hasła
        if (response.data.error) {
          alert(response.data.error);
        } else{
            alert("Poprawnie zmieniono hasło");
            history(`/`);
        }
      });
  };

  return (
    <div className="changepass">
      <h1>Zmień hasło</h1>
      <div><input type="text" placeholder="Stare Hasło..."  onChange={(event) => {setOldPassword(event.target.value); }}/></div>
      <div><input  type="text" placeholder="Nowe Hasło..."  onChange={(event) => { setNewPassword(event.target.value);}}/></div>
      <button onClick={changePassword}> Zapisz Zmiany</button>
    </div>
  );
}

export default ChangePassword;