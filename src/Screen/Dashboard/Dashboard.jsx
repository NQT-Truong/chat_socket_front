import React, {useEffect, useState} from "react";

import {
    MDBCard, MDBCardBody,
    MDBRow, MDBCol,
    MDBInputGroup, MDBBtn,
    MDBIcon
} from "mdbreact";

import {notification} from 'antd';

import {useSelector, shallowEqual, useDispatch} from "react-redux";
import {toggleSidebar} from "../../Redux/Actions/appActions";

import io from "socket.io-client";
import apiMess from "../../Api/Message/Message";
import apiListUser from "../../Api/ListUserRoom/ListUser";
import Sidebar from "../../Component/Layouts/Sidebar/Sidebar";
import Main from "../../Component/Layouts/Main/Main";
import Content from "../../Component/Layouts/Content/Content";
import SidebarRight from "./SidebarRight";

const Dashboard = () => {

    // define
    const user = useSelector(state => state.user, shallowEqual);
    const dispatch = useDispatch();
    const app = useSelector(state => state.app);

    // state
    const [data, setData] = useState("");
    const [messAll, setMessAll] = useState([])
    const [listOnline, setListOnline] = useState([]);
    const [socket, setSocket] = useState(null);
    const [dtRoom, setDtRoom] = useState("");
    const [roomName, setRoomName] = useState("");
    const [listUserInRoom, setListUserInRoom] = useState([]);
    const [avatar, setAvatar] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const scrollToBottom = () => {
        const elm = document.getElementById("temp")
        elm.scrollIntoView(false);
    };

    // lifecycle
    useEffect(() => {
        setAvatar(user.avatar)
    },[user]);

    useEffect(() => {
        if (roomName === '') return null;
        scrollToBottom()
    }, [data, messAll]);

    useEffect(() => {
        const socket = io
        (
            "http://18.139.208.99:3333",
            {
                transports: ['websocket',
                    'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling']
            }
        );

        setSocket(socket);

        socket.on("code_room", (dt) => {
            setRoomName(dt)
        })

        socket.emit("Sign", {
            username: user.username,
            avatar: user.avatar
        });

        socket.on("list_online", (dt) => {
            setListOnline(dt)
        })

        // socket.on("users_room", (dt) => {
        //     console.log(dt, listOnline)
        //     dt.forEach(data1 => {
        //         listOnline.forEach(data2 => {
        //             if (data2.name === data1 && data1 !== ListUserRoom.username){
        //                 // console.log("ok")
        //                 setListUserInRoom(prev => (
        //                     [...prev, data2.name]
        //                 ))
        //             }
        //         })
        //     })
        //     // dt.map((dt) => {
        //     //     listOnline.map((d) => {
        //     //         if (d.name === ListUserRoom.username) return null;
        //     //         if (dt === d.id) {
        //     //             listUserInRoom.push(d.name)
        //     //         }
        //     //     })
        //     // })
        // })

        socket.on("mess_from_server", (dt) => {
            // console.log(dt)
            if (dt.id === user.username) return null;
            setMessAll(prevState => {
                prevState = JSON.parse(JSON.stringify(prevState));
                return ([
                    ...prevState,
                    dt
                ])
            })
        })
    }, [user])

    useEffect(() => {
        if (roomName === '') return setMessAll([]);
        apiListUser.getListUser({
            roomName
        }, (err, result1) => {
            if (result1) {
                apiMess.getListMess({
                    roomName
                }, (err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
                        setListUserInRoom(result1)
                        result.forEach((dt) => {
                            setMessAll(prevState => {
                                prevState = JSON.parse(JSON.stringify(prevState));
                                return ([
                                    ...prevState,
                                    {
                                        data: dt.content,
                                        id: dt.user
                                    }
                                ])
                            })
                        })
                    }
                })
            }
        })
        scrollToBottom();
    }, [roomName])

    // function
    const sendMess = () => {
        if (roomName === '') {
            notification.warning({
                title: "Thông báo",
                description: "Hãy nhập mã phòng để trò chuyện"
            })
        } else {
            setMessAll(prevState => {
                prevState = JSON.parse(JSON.stringify(prevState));
                return ([
                    ...prevState,
                    {
                        data: data,
                        id: user.username
                    }
                ])
            })
            socket.emit("mess_from_client", {data: data, id: user.username});
        }
        setData("")
    };

    const handleSend = (e) => {
        e.preventDefault();
        setData(e.target.value)
    };

    const handleToggleSidebar = React.useCallback(() => {
        dispatch(toggleSidebar());
    }, [dispatch]);

    const handleCloseModal = () => {
        setIsVisible(false);
    }
    //_________________________________//

    return (
        <div className={`wrapper ${app.theme} frame-container`}>
            <Main>
                <Content>
                    <MDBCol className="dashboard_page justify-content-between flex-column">
                        <SidebarRight
                            isVisible={isVisible}
                            onClose={handleCloseModal}
                            avatar={avatar}
                            roomName={roomName}
                            username={user.username}
                        />
                        <div className='d-flex  my-2'>
                            <MDBBtn className='bg-white round btn-toggle-sidebar' color='light' onClick={handleToggleSidebar}>
                                <MDBIcon icon="bars" className="text-default"/>
                            </MDBBtn>
                            <MDBBtn className='bg-white round btn-toggle-sidebar ml-2' color='light' onClick={() => setIsVisible(true)}>
                                <MDBIcon icon="info-circle" className="text-default" size='1x'/>
                            </MDBBtn>
                        </div>

                        <MDBRow className="justify-content-center">
                            <MDBCol className="pt-2" lg={8} sm={12}>
                                <div className="d-flex justify-content-center">
                                    <MDBCol>
                                        <MDBCard className="box-chat">
                                            <MDBCardBody className="p-3 d-flex justify-content-between frame-content">
                                                <MDBCol>
                                                    {
                                                        messAll.map((dt) => (
                                                            <MDBRow className="mb-4">
                                                                <MDBCol className="p-0 text-white text-left">
                                                                    <div>
                                                            <span
                                                                className={`bg-white  p-2 rounded ${dt.id === user.username ? "d-none" : "text-dark"}`}>
                                                                {dt.id !== user.username ? dt.data : ""}
                                                            </span>
                                                                    </div>
                                                                    <span
                                                                        className={`${dt.id === user.username ? "d-none" : "font-italic small"}`}>{dt.id}</span>
                                                                </MDBCol>
                                                                <MDBCol className="w-50 text-white text-right p-0">
                                                        <span
                                                            className={`bg-default p-2 rounded ${dt.id !== user.username ? "d-none" : ""}`}>
                                                            {dt.id === user.username ? dt.data : ""}
                                                        </span>
                                                                </MDBCol>
                                                            </MDBRow>
                                                        ))
                                                    }
                                                    <div id="temp"/>
                                                </MDBCol>
                                            </MDBCardBody>
                                            <form onSubmit={() => sendMess()} className="p-1 px-2 ">
                                                <MDBInputGroup
                                                    onChange={(e) => handleSend(e)}
                                                    material
                                                    className="text-white"
                                                    hint="Nhập tin nhắn"
                                                    containerClassName="mb-3 mt-0"
                                                    value={data}
                                                    append={
                                                        <MDBBtn
                                                            type="submit"
                                                            className="z-depth-0 px-3 py-2 mx-2 rounded"
                                                            onClick={() => sendMess()}
                                                            disabled={data === ""}
                                                        >
                                                            <MDBIcon icon="paper-plane"/>
                                                        </MDBBtn>
                                                    }
                                                />
                                            </form>
                                        </MDBCard>
                                    </MDBCol>
                                </div>
                            </MDBCol>
                        </MDBRow>
                        <div className="d-flex justify-content-end">
                            <span className="font-italic" style={{color: "#a9014b"}}>@Developer: Quang Truong</span>
                        </div>
                    </MDBCol>
                </Content>
            </Main>
            <Sidebar
                socket={socket}
                dtRoom={dtRoom}
                setDtRoom={setDtRoom}
                setMessAll={setMessAll}
                listOnline={listOnline}
                roomName={roomName}
                listUserInRoom={listUserInRoom}
                setListUserInRoom={setListUserInRoom}
                setRoomName={setRoomName}
                avatar={avatar}
                setAvatar={setAvatar}
            />
        </div>
    )
}

export default Dashboard;