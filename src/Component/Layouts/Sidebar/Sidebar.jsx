import React, {useState} from 'react';

import {
    List, ListItem, ListItemIcon, ListItemText,
    Divider, Card, Collapse, IconButton, CardContent, CardActions
} from "@material-ui/core";
import {Avatar, Image, Modal, notification} from "antd";
import {MDBBtn, MDBIcon, MDBInputGroup} from "mdbreact";
import ScrollableFeed from 'react-scrollable-feed';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {toggleSidebar} from "../../../Redux/Actions/appActions";
import {userChange, userClear} from "../../../Redux/Actions/userAction";

import logo from "../../../Assets/img/logo.ico"
import Notify from "../../../Utils/Notify/Notify";

/**
 *
 * @returns {*}
 * @constructor
 */
const Sidebar = ({socket, dtRoom, setDtRoom, setMessAll, listOnline, roomName, avatar, listUserInRoom, setRoomName, setListUserInRoom, setAvatar}) => {

    const app = useSelector(state => state.app);
    const user = useSelector(state => state.user, shallowEqual);

    const dispatch = useDispatch();

    const handleToggleSidebar = React.useCallback(() => {
        dispatch(toggleSidebar());
    }, [dispatch]);

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [expandCardListOnline, setExpandCardListOnline] = useState(false);
    const [expandCardUserInRoom, setExpandCardUserInRoom] = useState(false);

    // function
    const handleLogOut = () => {
        dispatch(userClear());
        socket.emit("logout", user.username);
        Notify.success('Thông báo', 'Đăng xuất thành công');
    };

    const handleCreateRoom = () => {
        socket.emit("create_room", {
            roomName: dtRoom,
            user: {
                username: user.username,
                avatar: avatar,
                uuid: user.uuid
            }
        });
        setDtRoom("");
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
        setListUserInRoom([]);
        setRoomName("");
    };

    const handleSelected = (room) => {
        if (room) {
            setExpandCardUserInRoom(prev => !prev);
            // setExpandCardListOnline(false);
        } else {
            // setExpandCardUserInRoom(false);
            setExpandCardListOnline(prev => !prev);
        }
    };

    // Encode base64 image
    const getBase64 = (file, callback) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            callback(reader.result)
        };
    };

    // Upload and change image
    const handleChangeImage = (e) => {
        if (!e.target.files[0]) return null;
        getBase64(e.target.files[0], (result) => {
            socket.emit("change-avt", {
                user: user.uuid,
                avatar: result
            });
            setAvatar(result);
            dispatch(userChange({...user, avatar: result}));
            notification.success({
                title: "Thông báo",
                description: "Cập nhật ảnh thành công"
            })
        });
    };

    return (
        <>
            <div
                className={`sidebar-overlay d-block d-md-none ${app.isOpenSidebar ? "show" : ""}`}
                onClick={handleToggleSidebar}
            />
            <Modal
                title="Thông báo"
                visible={isOpenModal}
                onOk={() => handleLogOut()}
                onCancel={() => setIsOpenModal(false)}
            >
                <h5>Đăng xuất?</h5>
            </Modal>
            <div className={`sidebar justify-content-between d-flex flex-column ${app.isOpenSidebar ? "open" : ""}`}>
                <div>
                    <List>
                        <ListItem className='no-hover'>
                            <ListItemIcon>
                                <img alt="logo" src={logo} style={{width: 50, height: 50}}/>
                            </ListItemIcon>
                            <ListItemText className='title-logo'>
                                Chat New
                            </ListItemText>
                        </ListItem>
                    </List>
                    <Divider className="bg-white"/>
                    <div className=" align-items-center mt-3">
                        <MDBInputGroup
                            onChange={(e) => setDtRoom(prev => {
                                prev = e.target.value;
                                return prev;
                            })}
                            material
                            className="code-room"
                            hint="Mã phòng"
                            containerClassName="mb-3 mt-0"
                            value={dtRoom}
                            append={
                                <MDBBtn
                                    className="z-depth-0 m-o px-2 py-1 ml-2"
                                    onClick={() => handleCreateRoom()}
                                    disabled={dtRoom === ""}
                                >
                                    Tạo/Nhập
                                </MDBBtn>
                            }
                        />

                        <ScrollableFeed className="scroll-card">
                            <Card className="card_container mt-2">
                                <CardActions
                                    disableSpacing
                                    className="d-flex justify-content-between card_action text-white"
                                    onClick={() => handleSelected()}
                                >
                                    Danh sách trực tuyến <MDBIcon icon="circle" className="green-text" size="sm"/>
                                    <IconButton
                                        className={`text-white ${expandCardListOnline ? "expand_open" : "p-0"}`}
                                    >
                                        <ExpandMoreIcon className="color-white"/>
                                    </IconButton>
                                </CardActions>
                                <Collapse
                                    in={expandCardListOnline}
                                    unmountOnExit
                                >
                                    <CardContent className="card_content">
                                        <div className="px-2 data_online">
                                            {
                                                listOnline?.map((data) => {
                                                    if (data.name === user.username) return null;
                                                    return (
                                                        <div
                                                            className="border-bottom p-2 d-flex justify-content-between align-items-center"
                                                            // onClick={() => handleCreateRoom(data.id)}
                                                        >
                                                            {data.name}
                                                            <Avatar
                                                                className='bg-white d-flex justify-content-center align-items-center'
                                                                src={<Image
                                                                    src={data.avatar ? `${data.avatar}` : logo}/>}
                                                            />
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </CardContent>
                                </Collapse>
                            </Card>

                            <Card className="card_container my-2">
                                <CardActions
                                    disableSpacing
                                    className="d-flex justify-content-between card_action text-white"
                                    onClick={() => handleSelected("room")}
                                >
                                    Mọi người trong phòng: {roomName}
                                    <IconButton
                                        className={`text-white ${expandCardUserInRoom ? "expand_open" : "p-0"}`}
                                    >
                                        <ExpandMoreIcon className="color-white"/>
                                    </IconButton>
                                </CardActions>
                                <Collapse
                                    in={expandCardUserInRoom}
                                    unmountOnExit
                                >
                                    <CardContent className="card_content">
                                        <div className="px-2">
                                            {
                                                listUserInRoom?.map((data) => (
                                                    <div className="border-bottom p-2 justify-content-between d-flex">
                                                        <span className="text-white">{data.username}</span>
                                                        <Avatar
                                                            className='bg-white d-flex justify-content-center align-items-center'
                                                            // src={<Image src={data.avatar ? `${data.avatar}` : logo}/>}
                                                            src={logo}
                                                        />
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </CardContent>
                                </Collapse>
                            </Card>
                        </ScrollableFeed>
                    </div>
                </div>
                <div className="d-flex flex-column justify-content-end">
                    <MDBBtn className='frame-btn-avatar d-flex justify-content-center align-items-center'>
                        <input
                            className='file-input'
                            type="file"
                            onChange={handleChangeImage}
                            accept=".png,.jpg,.jpeg"
                        />
                        Cập nhật ảnh
                        <MDBIcon icon="user-circle" className="ml-1"/>
                    </MDBBtn>
                    <MDBBtn
                        className="py-2 my-2 d-flex justify-content-center align-items-center"
                        onClick={() => handleLeaveRoom()}
                        disabled={roomName === ""}
                    >
                        Rời phòng <MDBIcon icon="angle-double-right" className="ml-1"/>
                    </MDBBtn>
                    <MDBBtn
                        className="d-flex justify-content-center align-items-center py-2"
                        color="primary"
                        onClick={() => setIsOpenModal(true)}
                    >
                        Đăng xuất <MDBIcon icon="sign-out-alt" className="ml-1"/>
                    </MDBBtn>
                </div>
            </div>
        </>
    )
};

export default Sidebar;
