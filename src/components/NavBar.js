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

const NavBar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(API_URL + '/auth/user', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
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
              Reserve Room
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/admin">Admin</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/profile">
              Profile
            </NavLink>
          </NavItem>
          <NavbarText>
            {user ? (
              <span>Welcome, {user.displayName}!</span>
            ) : (
              <span>
                <a href={API_URL+"/auth/google"}>Login</a>
              </span>
            )}
          </NavbarText>
        </Nav>
      </Navbar>
    </div>
  );
};

export default NavBar;
