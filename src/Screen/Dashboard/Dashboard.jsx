import React, {useEffect, useState} from "react";

import {
    MDBCard, MDBCardBody,
    MDBRow, MDBCol,
    MDBInputGroup, MDBBtn,
    MDBIcon
} from "mdbreact";

import {Modal, notification} from 'antd';

import {useSelector, shallowEqual, useDispatch} from "react-redux";
import {userClear} from "../../Redux/Actions/userAction";

import io from "socket.io-client";
import Notify from "../../Utils/Notify/Notify";
import apiMess from "../../Api/Message/Message";
import apiListUser from "../../Api/ListUserRoom/ListUser";


const Dashboard = () => {

    // define
    const user = useSelector(state => state.user, shallowEqual);
    const dispatch = useDispatch();

    // state
    const [data, setData] = useState("");
    const [messAll, setMessAll] = useState([])
    // const [isSend, setIsSend] = useState(false);
    const [listOnline, setListOnline] = useState([]);
    const [socket, setSocket] = useState(null);
    const [dtRoom, setDtRoom] = useState("");
    const [roomName, setRoomName] = useState("");
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [listUserInRoom, setListUserInRoom] = useState([]);

    const scrollToBottom = () => {
        const elm = document.getElementById("temp")
        elm.scrollIntoView(false);
    };

    // lifecycle
    useEffect(() => {
        if (roomName === '') return null;
        scrollToBottom()
    }, [data, messAll]);

    useEffect(() => {
        const socket = io
        (
            "http://localhost:3333",
            {
                transports: ['websocket',
                    'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling']
            }
        );

        setSocket(socket);

        socket.on("code_room", (dt) => {
            setRoomName(dt)
        })

        socket.emit("Sign", user.username);

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
    }, [user.username])

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

    const handleLogOut = () => {
        dispatch(userClear());
        socket.emit("logout", user.username);
        Notify.success('Thông báo', 'Đăng xuất thành công');
    }

    const handleCreateRoom = (dt) => {
        socket.emit("create_room", {roomName: dtRoom, username: user.username});
        setDtRoom("");
        // setListUserInRoom(prev => [...prev, ListUserRoom.username]);
        setMessAll([])
        // tinh nang click vao ten de nhan tin
        // if (dt) {
        //     let data = {
        //         socketId: dt,
        //         key: "single"
        //     }
        //     socket.emit("create_room", data);
        //     listUserInRoom.push(ListUserRoom.username);
        // } else {
        //     socket.emit("create_room", dtRoom);
        //     setDtRoom("");
        //     listUserInRoom.push(ListUserRoom.username);
        // }
    };

    const handleLeaveRoom = () => {
        socket.emit("leave_room", roomName);
        setRoomName("")
    }
    //_________________________________//

    return (
        <div className="dashboard_page px-3 pt-5 justify-content-between flex-column">
            <MDBRow className="w-100 h-100">
                <Modal
                    title="Thông báo"
                    visible={isOpenModal}
                    onOk={() => handleLogOut()}
                    onCancel={() => setIsOpenModal(false)}
                >
                    <h5>Đăng xuất?</h5>
                </Modal>
                <MDBCol>
                    <div className="d-flex justify-content-center">
                        <MDBCol lg={3}>
                            <MDBInputGroup
                                onChange={(e) => setDtRoom(prev => {
                                    prev = e.target.value;
                                    return prev;
                                })}
                                material
                                hint="Mã room"
                                containerClassName=" mb-3 mt-0"
                                value={dtRoom}
                                append={
                                    <MDBBtn
                                        className="z-depth-0 m-o px-3 py-1 ml-3"
                                        onClick={() => handleCreateRoom()}
                                        disabled={dtRoom === ""}
                                    >
                                        <MDBIcon icon="plus" className="mr-1"/>Tạo/Nhập
                                    </MDBBtn>
                                }
                            />
                            <div className="mb-2">
                                <text className="text-info">
                                    Username: <span
                                    style={{color: "", fontWeight: "bold", fontSize: "16px"}}>{user.username}</span>
                                </text>
                                <div>
                                    Code room: {roomName}
                                </div>
                            </div>
                            <MDBCard>
                                <div className="d-flex align-items-center justify-content-center border-bottom">
                                    <div className="font-weight-bold m-0 p-2">
                                        Danh sách online <MDBIcon icon="circle" className="green-text" size="sm"/>
                                    </div>
                                </div>
                                <MDBCardBody>
                                    <div className="px-2 data_online">
                                        {
                                            listOnline?.map((data) => {
                                                if (data.name === user.username) return null;
                                                return (
                                                    <div className="border-bottom p-2"
                                                        // onClick={() => handleCreateRoom(data.id)}
                                                    >
                                                        {
                                                            data.name
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                        {/*{*/}
                        {/*    messAll.length === 0 ? <div id="temp"/> :*/}
                        <MDBCol lg={6}>
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
                        {/*}*/}
                        <MDBCol lg={3}>
                            <div className="d-flex justify-content-center">
                                <MDBBtn
                                    className="z-depth-0 m-o px-3 py-2 mr-2"
                                    onClick={() => handleLeaveRoom()}
                                    disabled={roomName === ""}
                                >
                                    Rời phòng <MDBIcon icon="angle-double-right" className="ml-1"/>
                                </MDBBtn>

                                <MDBBtn
                                    className="z-depth-0 m-o px-3 py-2"
                                    color="primary"
                                    onClick={() => setIsOpenModal(true)}
                                >
                                    Đăng xuất <MDBIcon icon="sign-out-alt" className="ml-1"/>
                                </MDBBtn>
                            </div>
                            <MDBCard className="mt-2">
                                <div className="d-flex align-items-center justify-content-center border-bottom">
                                    <div className="font-weight-bold m-0 p-2 text-center">
                                        Mọi người trong: {roomName}
                                        <MDBIcon icon="circle" className="green-text ml-1" size="sm"/>
                                    </div>
                                </div>
                                <MDBCardBody>
                                    <div className="px-2">
                                        {
                                            listUserInRoom?.map((data) => (
                                                <div className="border-bottom p-2">
                                                    {
                                                        data
                                                    }
                                                </div>
                                            ))
                                        }
                                    </div>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </div>
                </MDBCol>
            </MDBRow>
            <div className="d-flex justify-content-end">
                <span className="font-italic" style={{color: "#a9014b"}}>@Developer: Quang Truong</span>
            </div>
        </div>
    )
}

export default Dashboard;