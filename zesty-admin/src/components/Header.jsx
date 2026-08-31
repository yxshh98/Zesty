import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Badge, Container, NavDropdown } from "react-bootstrap"
import "../assets/css/header.css"
import { SidebarContext } from '../context/sidebarContext';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true }
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, allRestaurants: action.payload }
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload }
        default:
            return state;
    }
}

export default function Header() {
    const { toggleSidebar } = useContext(SidebarContext);
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("username");
        navigate("/admin/signin");
    }

    const [{ loading, error, allRestaurants }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        allRestaurants: []
    });

    const [counter, setCounter] = useState(0);

    useEffect(() => {

    }, []);


    return (<>
        <header className='navbar navbar-expand-lg justify-content-start'>
            <Container>
                <button className='sidebar-toggle' onClick={() => toggleSidebar()}>
                    <i className='fa fa-bars'></i>
                </button>
                <Link to="/">
                    <h1 className='logo'>Zesty</h1>
                </Link>
                <div className="user-info">

                    {allRestaurants.map((res) => {
                       return res.verified === "Pending" && setCounter((prevValue) => prevValue + 1)
                    })}

                    {counter === 0 ?
                        <Link to="/admin/notifications" style={{ color: "black", display: 'flex', alignContent: "flex-start" }}>
                            <i class="fa-solid fa-bell"></i>
                        </Link>
                        :
                        <Link to="/admin/notifications" style={{ color: "black", display: 'flex', alignContent: "flex-start" }}>
                            <i class="fa-solid fa-bell"></i>
                            <Badge bg="dark" style={{padding: "2px 0 0 0", fontSize: "12px", height: "15px", width: "12px"}}>{counter}</Badge>
                        </Link>
                    }
                    <NavDropdown className='info-name' title="Admin" id='dropdown'>
                        <NavDropdown.Item disabled href='#'><h5 style={{ color: "black", width: "200px", margin: "10px 10px 10px 0" }}>Welcome back</h5></NavDropdown.Item>
                        <NavDropdown.Item disabled href='#'><p style={{ color: "" }}>Admin</p></NavDropdown.Item>
                        <NavDropdown.Item className='nav-link' onClick={handleLogout}>
                            <i className="fa-solid fa-arrow-right-from-bracket" style={{ fontSize: "18px", color: "red" }}></i>
                            <span style={{ color: "red" }}>Log Out</span>
                        </NavDropdown.Item>
                    </NavDropdown>
                </div>
            </Container>
        </header>

    </>
    )
}
