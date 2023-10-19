import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { getDbData } from "../utilities/firebase";
import useEventStore from "../stores/eventStore";
import "./root.css";

import Banner from "../components/Banner";

const Root = () => {
    const setEvents = useEventStore((state) => state.setEvents);

    useEffect(() => {
        getDbData("/events").then((data) => {
          setEvents(data);
        }).catch((error) => {
          console.log(error);
        });
      }, []);

    return (
        <div className="App min-h-screen flex flex-col">
            <Banner />
            <div className="flex-grow mt-12 md:mt-16">
                <Outlet />
            </div>
            <footer className="w-full p-8">
                <p className="text-center text-default-500 text-sm">Northwestern University</p>
                <p className="text-center text-default-500 text-sm">© 2023 Wildcat Central</p>
            </footer>
        </div>
    );
};

export default Root;
