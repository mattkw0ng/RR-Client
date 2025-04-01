import React, { createContext, useContext, useState, useEffect } from "react";
import API_URL from "../config";
import axios from "axios";

const defaultRoomsState = {
  roomListSimple: [],
  roomsGrouped: {},
  rooms: []
};
const RoomsContext = createContext(defaultRoomsState);

export const useRooms = () => useContext(RoomsContext);

export const RoomsProvider = ({ children }) => {
  const [rooms, setRooms] = useState(defaultRoomsState);
  const [loading, setLoading] = useState(true);

  // Fetch user data on initial load
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/rooms`, { withCredentials: true });;
        console.log("RoomsContext response", response.data)
        setRooms(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setRooms(false)
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    if (rooms !== null) {
      setLoading(false);
    }
    console.log("room data updated: ", rooms);
  }, [rooms]);

  useEffect(() => {
    console.log("loading (rooms) status updated: ", loading);
  }, [loading]);

  return (
    <RoomsContext.Provider value={{ rooms, setRooms, loading }}>
      {children}
    </RoomsContext.Provider>
  );
};
