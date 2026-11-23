import React from 'react'
import "../styles/Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar">
            <h2 className="logo">Hotel Details</h2>

            <div className="nav-links">
                <a href="/">Home</a>
                <a href="/">Hotels</a>
                <Link to="/hotels/new" className="add-hotel-btn">
                     Add Hotel
                </Link>
            </div>
        </nav>
    )
}

export default Navbar