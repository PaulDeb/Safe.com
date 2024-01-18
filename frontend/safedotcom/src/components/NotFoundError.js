import React from "react";
import Image from "../assets/images/404_error.jpg"

import "../scss/not_found_error.scss";

const NotFoundError = () => {
    return (
        <div className="not-found-container">
            <img src={Image} alt="erreur 404: page non trouvée"/>
        </div>
    );
}

export default NotFoundError;