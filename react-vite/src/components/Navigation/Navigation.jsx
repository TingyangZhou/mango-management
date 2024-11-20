import "./Navigation.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import ProfileButton from "./ProfileButton.jsx"
import { FaFeather, FaSearch } from "react-icons/fa"


function Navigation() {
  const sessionUser = useSelector((state) => state.session.user);
  const navigate = useNavigate()


  const navClassName = sessionUser ? "nav-bar-main": "hidden-home-link"
  return (
    <nav  className={navClassName}>
      <ul className="nav-link">
          <li>
            <NavLink className='mango-logo' to="/">
              <img src="/images/mango_logo.jpg" alt="Mango Logo" width="70" height="70" />
          </NavLink>
          </li>
          <li><NavLink className='nav-propreties' activeClassName = "active" to="/">Properties</NavLink></li>
          <li><NavLink className='nav-invoices' activeClassName = "active" to="/">Invoices</NavLink></li>
      </ul>
      <div>
        <ProfileButton/>
      </div>
    </nav>
  );
}


export default Navigation;


