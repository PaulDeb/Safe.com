import React from "react";

import "../scss/account.scss";

const Account = () => {
    //const indexUrl = window.location.href.split("account/");
    //const subpage = urlCompose[urlCompose.length - 1];
    

    return(
        <div className="account-container">
            <div className="menu-container">
                <div className="menu-title">Paramètres</div>
                <ul className="menu-list">
                    <li>Profil</li>
                    <li>Cours</li>
                    <li>A propos</li>
                    <li>Se déconnecter</li>
                </ul>
            </div>
            <div className="display-container">

            </div>
        </div>
    );
};

export default Account;