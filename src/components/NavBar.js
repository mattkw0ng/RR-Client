import React from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarText,
} from 'reactstrap';
import API_URL from '../config';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

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
            {user ? (
              <span className='text-white' >Welcome, {user.displayName}!</span>
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
