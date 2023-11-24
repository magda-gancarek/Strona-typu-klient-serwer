import React from 'react';
import {Link} from 'react-router-dom';

function PageNotFound() {
  return (
    <div>
      <h1> Page not found </h1>
      <h2> 
      Strona Główna : <Link to="/">Home Page</Link></h2>
    </div>
  );
}

export default PageNotFound


