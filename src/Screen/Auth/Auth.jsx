import React, {useEffect, useState} from "react";
import {MDBCard, MDBCardBody, MDBInput} from "mdbreact";
import {notification} from "antd";

import { useDispatch} from "react-redux";
import {userChange} from "../../Redux/Actions/userAction";

import ButtonLoading from "../../Component/CustomTag/ButtonLoading";

import apiAuth from "../../Api/Auth/Auth"

/**
 *
 * @returns {*}
 * @constructor
 */
function Auth() {

    // define
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = React.useState(false);

    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isRegister, setIsRegister] = useState(false);

    useEffect(() => {
        setIsLoading(false);
        setEmail("");
        setPassword("");
        setUsername("")
    }, [isRegister])


    // function
    const handleLogin = () => {
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        apiAuth.login({
            username,
            password
        }, (err, result) => {
            if (result) {
                dispatch(userChange(result));
            } else {
                notification.error({
                    title: "Cảnh báo",
                    description: `${err.response.data}`
                })
            }
            setIsLoading(false);
        })
    };

    const handleRegister = () => {
        if (!email || !username || !password) {
            return notification.error({
                title: "Cảnh báo",
                description: "Các trường không được để trống"
            })
        }

        apiAuth.register({
            name: username,
            password,
            email
        }, (err, result) => {
            if (err) {
                notification.error({
                    title: "Cảnh báo",
                    description: `${err.response.data}`
                })
            } else {
                notification.success({
                    title: "Thông báo",
                    description: "Đăng ký tài khoản thành công"
                });
                setEmail("");
                setPassword("");
                setUsername("")
            }
            setIsLoading(false);
        })
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        switch (name) {
            case "username":
                setUsername(value);
                break;
            case "email":
                setEmail(value);
                break;
            default:
                setPassword(value);
        }
    };

    return (
        <div className="auth-page">
            <MDBCard className="frame_card">
                <MDBCardBody>
                    <div className='form-groups row-horizontal-center'>
                        <div className='form-container'>
                            <div className="d-flex justify-content-center mb-2">
                                <h4>Chat New</h4>
                            </div>
                            {
                                isRegister ?
                                    <MDBInput
                                        label="Email"
                                        icon="envelope"
                                        value={email}
                                        onChange={handleChange}
                                        name="email"
                                        autoComplete='off'
                                        className="animation"
                                    /> : ""
                            }
                            <MDBInput
                                label="Tài khoản"
                                icon="user"
                                value={username}
                                onChange={handleChange}
                                name="username"
                                autoComplete='off'
                            />
                            <MDBInput
                                label="Mật khẩu"
                                icon="lock"
                                type='password'
                                value={password}
                                onChange={handleChange}
                                name="password"
                                autoComplete='off'
                            />
                        </div>
                    </div>
                    <div className='button-group row-horizontal-center'>
                        <ButtonLoading
                            className='bg-gradient-success shadow'
                            title={isRegister ? "Đăng ký" : 'ĐĂNG NHẬP'}
                            loading={isLoading}
                            onClick={isRegister ? handleRegister : handleLogin}
                        />
                    </div>
                    <div className="d-flex justify-content-center mt-2">
                        <a
                            className="font-italic"
                            onClick={() => setIsRegister(prev => !prev)}
                        >
                            {
                                isRegister ? "Đã có tài khoản ? Đăng nhập ngay!" :
                                    "Bạn chưa có tài khoản? Đăng ký ngay!"
                            }
                        </a>
                    </div>
                </MDBCardBody>
                <div className="justify-content-center d-flex">
                    <span className="font-italic" style={{color: "#a9014b"}}>@Developer: Quang Truong</span>
                </div>
            </MDBCard>
        </div>
    )
}

export default Auth;
