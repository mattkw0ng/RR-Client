import React, { useEffect, useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarText,
} from 'reactstrap';
import API_URL from '../config';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const [stateUser, setStateUser] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    axios
      .get(API_URL + '/api/auth/stateUser', { withCredentials: true })
      .then((response) => {
        if (response.data.stateUser) {
          setStateUser(response.data.stateUser);
        } else {
          console.error('Not authenticated');
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <Navbar>
        <NavbarBrand href="/">RoomReservation</NavbarBrand>
        <Nav>
          <NavItem>
            <NavLink href="/">
              Search Rooms
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink href="/room-reservation-form">
              Reserve Room
            </NavLink>
          </NavItem>
          {
            (user && ['admin', 'superadmin'].includes(user.role)) &&
            <NavItem>
              <NavLink href="/admin">Admin</NavLink>
            </NavItem>
          }
          <NavItem>
            <NavLink href="/profile">
              Profile
            </NavLink>
          </NavItem>
          <NavbarText>
            {stateUser ? (
              <span className='text-white' >Welcome, {stateUser.displayName}!</span>
            ) : (
              <span>
                <a className='text-white' href={API_URL + "/api/auth/google"}>Login</a>
              </span>
            )}
          </NavbarText>
        </Nav>
      </Navbar>
    </div>
  );
};

export default NavBar;
