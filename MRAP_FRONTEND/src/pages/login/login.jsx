import React, { useState } from "react";
import './styles.css';
// ANT DESIGN ICONS
import { UserOutlined, LockOutlined } from "@ant-design/icons";
// ANT DESIGN COMPONENTS
import { Input, Button, Image, message } from 'antd';
// js
import { handleSubmit } from "./loginAPI";
// ZUSTAND -> VARIABLE GLOBAL DE SESION DE USUARIO
import { useUserStore } from "../../store/userStore";
// REACT ROUTER
import { useNavigate } from "react-router-dom";

export const Login = () => {

    const { userInfo } = useUserStore()
    const { isLoged } = userInfo
    const logoutUser = useUserStore.getState().logoutUser; // Obtener la función de logout
    const navigate = useNavigate()

    return (
        <div className="full-screen-container">
            {
                isLoged == false ? (
                    <form className="login" onSubmit={(e) => handleSubmit(e, navigate)}>
                        <div className="title-container">
                            <Image
                                src="src/pages/login/imagenes/marcamuni.png"
                                preview={false}
                            />
                        </div>

                        <div className="input-container">
                            <Input
                                className="input-ant"
                                size="large"
                                placeholder="Usuario"
                                id="username"
                                name="username"
                                prefix={<UserOutlined />}
                            />

                            <Input.Password
                                className="input-ant"
                                size="large"
                                placeholder="Contraseña"
                                id="password"
                                name="password"
                                prefix={<LockOutlined />}
                            />

                            <Button
                                type="primary"
                                size="large"
                                loading={false}  // Muestra el estado de carga
                                className="button-ant"
                                htmlType="submit"
                                style={{ backgroundColor: '#68A544' }}
                            >
                                Login
                            </Button>
                        </div>
                    </form>
                ) : (
                    // navigate('/inicio')
                    <div>
                        <h1>usuario logeado</h1>
                        <button
                            onClick={logoutUser}
                        >
                            deslogear
                        </button>
                    </div>
                )
            }
            {/* 
            <form className="login" onSubmit={handleSubmit}>
                <div className="title-container">
                    <Image
                        src="src/componentes/login/imagenes/marcamuni.png"
                        preview={false}
                    />
                </div>

                <div className="input-container">
                    <Input
                        className="input-ant"
                        size="large"
                        placeholder="Usuario"
                        id="username"
                        name="username"
                        prefix={<UserOutlined />}
                    />

                    <Input.Password
                        className="input-ant"
                        size="large"
                        placeholder="Contraseña"
                        id="password"
                        name="password"
                        prefix={<LockOutlined />}
                    />

                    <Button
                        type="primary"
                        size="large"
                        loading={false}  // Muestra el estado de carga
                        className="button-ant"
                        htmlType="submit"
                        style={{ backgroundColor: '#68A544' }}
                    >
                        Login
                    </Button>
                </div>
            </form>
            */}
        </div>
    );
}
