import React from "react";
import logo from "../../images/logo.svg";
import "./header.css";
import Auth from "./header/Auth";



function Header({activeUser, ...props}) {
    
    const AuthUser = <span className="welcome_word">Welcome to chat,<span className="welcome_word name">{" " + activeUser}</span></span>;
    const AnonUser = <span className="welcome_word">Login required</span>;

    return (
        <header className="Chat-header">
            <img src={logo} className="Chat-logo" alt="Start page" />
            <div>
            {activeUser && activeUser.length > 0?
                    AuthUser :
                    AnonUser}
                
            </div>
            <Auth 
                props={{...props, activeUser}}
            />
        </header>
    );
}

export default Header;
