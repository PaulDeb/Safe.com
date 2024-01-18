import React from "react";
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ ...props }) => {
    const isConnected = sessionStorage.getItem("connected") === "true" ? true : false;

    return (isConnected) ? (
        props.element
    ) : (
       <Navigate to="/home"/>
    );
}

export default PrivateRoute;