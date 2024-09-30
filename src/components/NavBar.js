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

const NavBar = () => {
  const [user, setUser] = useState(null);

  const testSession = async () => {
    try {
      const start = new Date().toISOString();

      await axios.post(API_URL + '/auth/login', {
        start: start
      }, { withCredentials: true });
    } catch (error) {
      console.error('Error testing session', error);
    }
  };

  useEffect(() => {
    axios
      .get(API_URL + '/auth/user', { withCredentials: true })
      .then((response) => {
        if (response.data.user) {
          setUser(response.data.user);
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
            <NavLink onClick={testSession}>
              Test
            </NavLink>
          </NavItem>
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
                <a href={API_URL + "/auth/google"}>Login</a>
              </span>
            )}
          </NavbarText>
        </Nav>
      </Navbar>
    </div>
  );
};

export default NavBar;
