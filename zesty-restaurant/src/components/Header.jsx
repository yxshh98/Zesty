import React, { useContext, useEffect, useState } from 'react'
import { Container, Navbar, NavDropdown } from 'react-bootstrap'
import "../assets/css/header.css"
import "../assets/css/sidebar.css"
import axios from 'axios';
import { SidebarContext } from '../context/sidebarContext';
import { useNavigate } from "react-router-dom";

export default function Header() {
    const [restroName, setRestroName] = useState("");
    const restaurantId = localStorage.getItem("restaurantId");

    const getData = async () => {
        const res = await axios.get(`https://zesty-backend.onrender.com/restaurant/get/${restaurantId}`);
        setRestroName(res.data.restaurantName);
    }

    useEffect(() => {
        getData();
    }, [restaurantId]);

    const { toggleSidebar } = useContext(SidebarContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("restaurantId");
        navigate("/");
    }

    return (
        <header className='navbar navbar-expand-lg justify-content-start'>
            <button className='sidebar-toggle' onClick={() => toggleSidebar()}>
                <i className='fa fa-bars'></i>
            </button>
            <Container>
                <Navbar.Brand className='nav-brand' style={{ fontSize: "25px", marginTop: "50px" }}>
                    <img
                        alt="zesty"
                        src="/images/zesty-without-bg-black.png"
                        className="img-logo d-inline-block align-top"
                    />{' '}
                    <strong style={{ marginLeft: "-40px" }}>Zesty</strong>&nbsp;for restaurants
                </Navbar.Brand>

                <NavDropdown className='user-info info-name' style={{ color: "black" }} title={restroName} id='dropdown'>
                    <NavDropdown.Item disabled href='#'><h5 style={{ color: "black", width: "200px", margin: "10px 10px 10px 0" }}>Welcome back</h5></NavDropdown.Item>
                    <NavDropdown.Item disabled href='#'><p style={{ color: "" }}>{restroName}</p></NavDropdown.Item>
                    {/* <NavDropdown.Item href='#' className='nav-link'>
                        <i class="fa-solid fa-gear" style={{ fontSize: "18px" }}></i>
                        Account Setting
                    </NavDropdown.Item> */}
                    <NavDropdown.Item className='nav-link' onClick={handleLogout}>
                        <i className="fa-solid fa-arrow-right-from-bracket" style={{ fontSize: "18px", color: "red" }}></i>
                        <span style={{ color: "red" }}>Log Out</span>
                    </NavDropdown.Item>
                </NavDropdown>
            </Container>
        </header>
    )
}
