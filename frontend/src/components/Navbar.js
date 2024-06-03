import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';



const NavbarComponent = () => {

  const user = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
};
  


  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <a className="navbar-brand" href="#home">Super strona</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#basic-navbar-nav" aria-controls="basic-navbar-nav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="basic-navbar-nav">
    
        <div className="d-flex justify-content-between">
             {user ? (
              <button className='btn btn-primary mr-2' onClick={handleLogout}>
                      Logout
                  </button>
             ) : null} 
             <a href="https://ec.europa.eu/eurostat/web/covid-19/database" target="_blank" className="btn btn-secondary ml-2">Visit Source</a>
            </div>
          
            </div>

          </nav>
         
        );
      };

export default NavbarComponent;