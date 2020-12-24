import React from "react";
import {Drawer, Image} from "antd";
import logo from "../../Assets/img/logo.ico";

const SidebarRight = ({avatar, isVisible, onClose, roomName, username}) => {
    return (
        <Drawer
            visible={isVisible}
            onClose={() => onClose()}
            closable={false}
            title="Chi Tiết"
            className='sidebar-right'
        >
            <div className='avatar-group row-all-center mb-3'>
                <div className='row-all-center z-depth-1 round bg-white'>
                    <Image
                        src={avatar ? `${avatar}` : logo}
                        className="rounded m-auto d-block img-fluid"
                        alt="avatar"
                    />
                </div>
            </div>
            <div className="d-flex mb-1">
                <div className="mb-1">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            Tài khoản:
                            <span style={{fontWeight: "bold", fontSize: "16px"}} className="ml-2">{username}</span>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div>
                            Mã phòng:
                            <span style={{fontWeight: "bold", fontSize: "16px"}} className="ml-2">{roomName}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    )
}

export default SidebarRight;