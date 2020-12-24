import React, { useState } from "react";
import Header from "./app/Header.jsx";
import MainContainerForСhat from "./app/Сhat.jsx";
import { rand_uid } from '../utils/rand_UID'

function Home() {
    const [activeUser, setActiveUser] = useState('');

    const [cMessages, setcMessages] = useState([]);
    const [cActivUsers, setcActivUsers] = useState([]);
    const [token, setToken] = useState(null);


    const addSysMessage = (event, message) => {
        setcMessages( [
            ...cMessages,
            {
                uid: rand_uid(),
                type: "SysMessage",
                Event: event,
                Message: message,
                Time: new Date().getHours() + ":" + (new Date().getMinutes().toString().length > 1 ? new Date().getMinutes() : "0" + new Date().getMinutes()),
            },
        ]);
    };


    return (
        <div className="Chat">
            <Header 
                activeUser={activeUser} 
                setActiveUser={setActiveUser}
                cMessages={cMessages}
                setcMessages = {setcMessages}
                cActivUsers={cActivUsers}
                setcActivUsers={setcActivUsers}
                token={token}
                setToken={setToken}
                addSysMessage={addSysMessage}
            />
            <MainContainerForСhat />
        </div>
    );
}

export default Home;
