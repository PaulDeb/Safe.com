import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import ExpertIndicator from './ExpertIndicator';

import logo from '../assets/images/Safe_com_logo.png';
import accountIcon from '../assets/images/account_icon.png';
import "../scss/header.scss";

const Header = () => {
    const navigate = useNavigate();

    return(
        <>
            <header className="mainpage-header">
                <div className="flex-row">
                    <div className="header-logo-container">
                        <img
                            src={logo}
                            className="header-logo"
                            alt="logo"
                            onClick={() => navigate("/")}
                            />
                    </div>
                </div>
                <div className="flex-row">
                    <div className="expert-indicator">
                        <ExpertIndicator />
                    </div>
                    <div className="header-account-container">
                        <img
                            src={accountIcon}
                            className="header-account-img"
                            alt="account"
                            onClick={() => navigate("/login")}
                            />
                    </div>
                </div>
            </header>
            <Outlet />
        </>
    );
}

export default Header;