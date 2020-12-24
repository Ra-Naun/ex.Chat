import React, { useEffect, useState } from "react";
import "./auth.css";

import openSocket from "socket.io-client";

export default function Auth(props) {
    const { activeUser, setActiveUser, cMessages, setcMessages, cActivUsers, setcActivUsers, setToken, addSysMessage} = props.props;
    const [isAuth, setIsAuth] = useState(false);
    const [socket, setSocket] = useState(null);

    const toggle = () => {
        if (isAuth) {
            logOut();
        } else {
            initWebSocket();
        }
        setIsAuth((prev) => !prev);
    };

    const initWebSocket = () => {
        if (!isAuth) {
            setSocket(openSocket("https://nest-zuz.herokuapp.com/"));
            //вызовется  useEffect авторизации
        }
    };
    //авторизация после создания сокета
    useEffect(() => {
        if (socket) {
            addEventListeners();
            console.log('auth');
            socket.emit("auth");
        }

        function addEventListeners() {
            socket.on("accept", (message) => {
                console.log("accept", message);
                addSysMessage("", "Accept");
                setToken(message.token);
                setActiveUser(message.clientName);
            });

            socket.on("BAD_REQUEST", () => {
                console.log("BAD_REQUEST");
                addSysMessage("", "BAD_REQUEST");
            });

            socket.on("User not founded", () => {
                console.log("User not founded");
                addSysMessage("", "User not founded");
            });

            socket.on("Err", () => {
                console.log("Err");
                addSysMessage("", "Err");
            });

            socket.on("userDisconnected", (message) => {
                console.log("userDisconnected", message);
                if (activeUser !== message.clientName) addSysMessage("Disconnected: ", message.clientName);
                else addSysMessage("You disconnected", "( " + message.clientName + " ).");
                setcActivUsers([
                    ...cActivUsers.filter((user) => {
                        return user !== cActivUsers[cActivUsers.indexOf(message.clientName)];
                    }),
                ]);
            });

            let count = 0; //count of 'roomList' events (skip first event)
            socket.on("roomList", (message) => {
                console.log("roomList", message);
                if (count === 0) {
                    ++count;
                } else if (count === 1 && ++count) addSysMessage("You connected as ", activeUser);
                else {
                    message.list.forEach((user) => {
                        if (cActivUsers.indexOf(user) === -1) addSysMessage("Connected: ", user);
                    });
                }
                setcActivUsers([...message.list]);
            });

            socket.on("newMsg", (message) => {
                console.log("newMsg", message);
                if (
                    cMessages.filter((msg) => {
                        return msg.uid === message.msg.id;
                    }).length === 0
                ) {
                    setcMessages([
                        ...cMessages,
                        {
                            type: "UserMessage",
                            clientName: message.clientName,
                            uid: message.msg.id,
                            Time: new Date().getHours() + ":" + (new Date().getMinutes().toString().length > 1 ? new Date().getMinutes() : "0" + new Date().getMinutes()),
                            Message: message.msg.text,
                            MessageImgs: message.msg.img,
                        },
                    ]);
                }
            });
        }
        return logOut;
    },[socket]);

    const logOut = () => {
        if (socket) {
            addSysMessage("You disconnected", " (" + activeUser + ")");
            socket.close();
            setSocket(null);
            setActiveUser(null);
        } else addSysMessage("You are already ", "disconnected");
    };

    return (
        <div className="toggle">
            <label className="label_text__toogle">Authorization: </label>
            <input className="input__toggle" type="checkbox" id="buttonThree" checked={isAuth} onChange={toggle} />
            <label className="label__toggle" htmlFor="buttonThree">
                <i></i>
            </label>
        </div>
    );
}
