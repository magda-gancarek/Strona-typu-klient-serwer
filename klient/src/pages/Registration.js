import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {useNavigate} from 'react-router-dom';

function Registration() {
  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required("Pole obowiązkowe"),
    password: Yup.string().min(4).max(20).required("Pole obowiązkowe"),
  });

  let history = useNavigate();

//funkcja która będzie wywołana gdy naciśniemy submit czyli wysłanie danych do tabeli
//data - to co wpisaliśmy w pola przy rejestracji
  const onSubmit = (data) => {
    axios.post("http://localhost:3001/auth", data).then(() => {
      if(response.data.error) {
        alert(response.data.error);}
        else{
      console.log(data);
      alert("Poprawna rejestracja");
      history("/login");}
    });
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Login: </label>
          <ErrorMessage name="username" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="username"
            placeholder="Login..."
          />

          <label>Hasło: </label>
          <ErrorMessage name="password" component="span" />
          <Field
            autoComplete="off"
            type="password"
            id="inputCreatePost"
            name="password"
            placeholder="Hasło..."
          />

          <button type="submit"> Utwórz konto</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Registration;