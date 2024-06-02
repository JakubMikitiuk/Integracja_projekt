import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


const NavbarComponent = () => {

  

  const renderLoginForm = () => {
    return (
      <form className="form-inline d-flex">
        <input type="text" className="form-control mr-sm-2" placeholder="Username" />
        <input type="password" className="form-control mr-sm-2" placeholder="Password" />
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <a className="navbar-brand" href="#home">My App</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#basic-navbar-nav" aria-controls="basic-navbar-nav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="basic-navbar-nav">
    
        <div className="ml-auto">
          {renderLoginForm()}
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;