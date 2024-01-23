import React, { useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

import "../scss/account.scss";

const Account = () => {
    const navigate = useNavigate();
    const [isQuitting, setLogout] = useState(false);
    const indexUrl = window.location.href.indexOf("account");
    let subpage;
    
    try {
        subpage = window.location.href.substring(indexUrl + 8);
    } catch {
        subpage = '';
    }

    const logout = () => {
        sessionStorage.removeItem("connected");
        sessionStorage.removeItem("user");
        setLogout(true);
    };

    if (isQuitting)
        return (<Navigate to="/home"/>);

    return(
        <div className="account-container">
            <div className="menu-container">
                <div className="menu-title">Paramètres</div>
                <ul className="menu-list">
                    <li 
                        className={(subpage === '' || subpage === 'profile') ? "current" : ""}
                        onClick={() => navigate('/account/profile')}
                    >
                        Profil
                    </li>
                    <li
                        className={(subpage === 'cours') ? "current" : ""}
                        onClick={() => navigate('/account/cours')}
                    >
                        Cours
                    </li>
                    <li
                        className={(subpage === 'about') ? "current" : ""}
                        onClick={() => navigate('/account/about')}
                    >
                        A propos
                    </li>
                    <li onClick={logout}>Se déconnecter</li>
                </ul>
            </div>
            <div className="display-container">
                <Outlet/>
            </div>
        </div>
    );
};

export default Account;