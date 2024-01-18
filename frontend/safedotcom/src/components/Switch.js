import React from 'react';
import '../scss/switch.scss';

const Switch = (props) => {
    const { callback, value } = {...props};

    return (
        <>
            <input
                className="react-switch-checkbox"
                id="react-switch-new"
                type="checkbox"
                onChange={() => {
                    callback(!value);
                }}
                checked={value}
            />
            <label
                className={!!value ? "react-switch-label checked" : "react-switch-label"}
                htmlFor="react-switch-new"
            >
                <span className="react-switch-button" />
            </label>
        </>
    );
};

export default Switch;