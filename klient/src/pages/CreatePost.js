import React, {useContext, useEffect} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {AuthContext} from "../helpers/AuthContext";


function CreatePost() {
  const navigate = useNavigate();
  const {authState} = useContext(AuthContext);
  //dane w trakcie inicjalizacji nazych zmiennych
  const initialValues = {
    title: "",
    postText: "",
  };


  useEffect(() => {
    //sprawdzamy czy użytkownik jest zalogowany, jeśli nie to na stronę logowania
    if (!localStorage.getItem("accessToken")){
      navigate("/login");
    }
  },[]);


//wszytskie pola w naszym formluarzu i ich ograniczenia 
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Pole obowiązkowe"),
    postText: Yup.string().required("Pole obowiązkowe"),
  });

//onSubmit - funckja ktora będzie uruchomiona,
  const onSubmit = (data) => {


    axios.post("http://localhost:3001/posts", data, {headers: {accessToken: localStorage.getItem("accessToken")}}).then((response) => {
      //console.log(data) // wyświetli nam dane które wprowadzilismy w konsoli
      console.log("Wprowadzenie danyh do bazy - sukces");
      navigate(`/`);
    });
  };


  //przy Field "name" takie samo jak w fomularzu 
  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label> Opis: </label>
          <ErrorMessage name="title" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="title"
            placeholder="Opis zdjęcia"
          />
          <label>Zdjęcie: </label>
          <ErrorMessage name="postText" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="postText"
            placeholder=" (link url)"
          />
         
          <button type="submit"> Create Post</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;