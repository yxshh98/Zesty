import React, { useContext, useEffect, useState } from 'react'
import "../assets/css/sidebar.css"
import { navigationLinks } from "../data/data.js"
import { SidebarContext } from "../context/sidebarContext.js"
import { NavLink } from 'react-bootstrap'

export default function Sidebar({id}) {

    const [activeLinkIndex] = useState(id);
    const [sidebarClass, setSidebarClass] = useState("");
    const { isSidebarOpen } = useContext(SidebarContext);

    useEffect(() => {
        if (isSidebarOpen) {
            setSidebarClass("sidebar-change");
        } else {
            setSidebarClass("");
        }
    }, [isSidebarOpen])

    return (
        <div className={`sidebar ${sidebarClass}`}>

            {/* <form className="d-flex">
                <input className="form-control me-2 bg-light border-black ms-3" type="search" placeholder="Search" aria-label="Search" />
            </form> */}
            <nav className="navigation">
                <ul className="nav-list">
                    {
                        navigationLinks.map((navigationLinks) => (
                            <li className="nav-item" key={navigationLinks.id}>
                                <NavLink href={navigationLinks.link} className={`nav-link ${navigationLinks.id === activeLinkIndex ? 'active' : null} list-group-item-action`}>
                                    {/* <img src={navigationLinks.image} className='nav-link-icon' alt={navigationLinks.title} /> */}
                                    <i className={navigationLinks.image}></i>
                                    <span className="nav-link-text">{navigationLinks.title}</span>
                                </NavLink>
                            </li>
                        ))
                    }
                </ul>
            </nav>
        </div>
    )
}
