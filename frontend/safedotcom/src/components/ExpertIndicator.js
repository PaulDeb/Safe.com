import React from "react";
import '../scss/expert_indicator.scss';

const ExpertIndicator = () => {
    const isConnected = sessionStorage.getItem("connected") === "true" ? true : false;
    let user = sessionStorage.getItem("user");

    if (!isConnected)
        return (<></>);

    user = JSON.parse(user);

    if (!!user.expert)
        return(<div className="mode expert">Mode Expert</div>)

    return(<div className="mode debutant">Mode Débutant</div>)

};

export default ExpertIndicator;