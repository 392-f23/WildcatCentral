import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { getDbData } from "../utilities/firebase";
import useEventStore from "../stores/eventStore";
import { useLocation } from 'react-router-dom';
import "./root.css";

import Banner from "../components/Banner";

const Root = () => {
    const setEvents = useEventStore((state) => state.setEvents);

    const Location = useLocation();

    useEffect(() => {
        getDbData("/events").then((data) => {
          setEvents(data);
        }).catch((error) => {
          console.log(error);
        });
      }, []);

      console.log(Location)

    return (
        <div className="App min-h-screen flex flex-col">
            <Banner />
            <div className="flex-grow">
                <Outlet />
            </div>
            {Location.pathname !== '/map-view' && 
            <footer className="w-full p-8">
                <p className="text-center text-default-500 text-sm">Northwestern University</p>
                <p className="text-center text-default-500 text-sm">© 2023 Wildcat Central</p>
            </footer>
            }
        </div>
    );
};

export default Root;
