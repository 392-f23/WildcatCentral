import React from "react";
import { Outlet, useNavigation } from "react-router-dom";
import "./root.css";

import Banner from "../components/Banner";

const Root = () => {
    const navigation = useNavigation();

    return (
        <div className="App">
            <Banner />
            <Outlet />
            <footer className="w-full p-8">
                <p className="text-center text-default-500 text-sm">Northwestern University</p>
                <p className="text-center text-default-500 text-sm">© 2023 Wildcat Central</p>
            </footer>
        </div>
    );
};

export default Root;
