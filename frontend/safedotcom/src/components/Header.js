import React from 'react';
import { Outlet } from 'react-router-dom';

import logo from '../assets/images/Safe_com_logo.png';
import accountIcon from '../assets/images/account_icon.png';
import "../scss/header.scss";

const Header = () => {
    return(
        <>
            <header className="mainpage-header">
                <div className="header-logo-container">
                    <img src={logo} className="header-logo" alt="logo" />
                </div>
                <div className="header-account-container">
                    <img src={accountIcon} className="header-account-img" alt="account"/>
                </div>
            </header>
            <Outlet />
        </>
    );
}

export default Header;