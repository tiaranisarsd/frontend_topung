import React, { useState, useEffect, useCallback } from 'react';
import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { IoHome } from "react-icons/io5";
import { FaUserDoctor } from "react-icons/fa6";
import { FaInfoCircle, FaBars} from "react-icons/fa";
import logo from '../logo.png';
import { useNavigate, useLocation } from "react-router-dom";

function Header({ showLoginButtonInOffcanvas = true }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeLink, setActiveLink] = useState('/'); 

    const handleNavLinkClick = useCallback((path) => {
        setActiveLink(path);
        navigate(path);
    }, [navigate]);

    useEffect(() => {
        setActiveLink(location.pathname);
    }, [location.pathname]);

    return (
        <>
            <Navbar expand="lg" fixed="top" variant="light" className="navbar nav-underline bg-blue shadow-sm py-1 ">
                <Container>
                    {/* Logo */}
                    <Navbar.Brand href="/">
                        <img
                            src={logo}
                            width="55"
                            height="55"
                            className=" logo-navbar d-inline-block align-top me-2"
                            alt="Topung Logo"
                        />
                    </Navbar.Brand>

                    {/* Toggle hanya muncul di mobile */}
                                <Navbar.Toggle aria-controls="offcanvasNavbar" className="d-lg-none border-0 bg-blue">
                                <FaBars size={24} color="white" />
                                </Navbar.Toggle>

                    {/* MOBILE: Offcanvas untuk ukuran layar kecil */}
                    <Navbar.Offcanvas
                        id="offcanvasNavbar"
                        aria-labelledby="offcanvasNavbarLabel"
                        placement="start"
                        className="nav-underline bg-blue d-lg-none w-75"
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id="offcanvasNavbarLabel" className="fw-bold text-white">
                                Menu
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body className="d-flex flex-column mx-auto">
                            <Navbar.Collapse id="offcanvasNavbar" className="mx-auto">
                                <Nav className="flex-column text-white blue-hover mx-auto">
                                    <Nav.Link
                                        onClick={() => handleNavLinkClick("/")}
                                        className={`text-white blue-hover d-flex align-items-center ${activeLink === '/' ? 'active' : ''}`}
                                        href="/"
                                    >
                                        <IoHome className="me-2" /> Beranda
                                    </Nav.Link>
                                    <Nav.Link
                                        onClick={() => handleNavLinkClick("/terapis")}
                                        className={`text-white d-flex align-items-center ${activeLink === '/terapis' ? 'active' : ''}`}
                                        href="/terapis"
                                    >
                                        <FaUserDoctor className="me-2" /> Terapis
                                    </Nav.Link>
                                    <Nav.Link
                                        onClick={() => handleNavLinkClick("/tentang")}
                                        className={`text-white d-flex align-items-center ${activeLink === '/tentang' ? 'active' : ''}`}
                                        href="/tentang"
                                    >
                                        <FaInfoCircle className="me-2" /> Tentang
                                    </Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>

                    {/* DESKTOP: Nav & Login tampil horizontal */}
                    <div className="d-none d-lg-flex align-items-center justify-content-end flex-grow-1">
                        <Navbar.Collapse id="offcanvasNavbar" className="justify-content-between">
                            <Nav className="d-flex text-white blue-hover align-items-center justify-content-center flex-grow-1">
                                 <Nav.Link
                                    onClick={() => handleNavLinkClick("/")}
                                    className={`text-white blue-hover d-flex align-items-center me-3 ${activeLink === '/' ? 'active' : ''}`}
                                    href="/"
                                >
                                    <IoHome className="me-2" /> Beranda
                                </Nav.Link>
                                <Nav.Link
                                    onClick={() => handleNavLinkClick("/terapis")}
                                    className={`text-white blue-hover d-flex align-items-center me-3 ${activeLink === '/terapis' ? 'active' : ''}`}
                                    href="/terapis"
                                >
                                    <FaUserDoctor className="me-2" /> Terapis
                                </Nav.Link>
                                <Nav.Link
                                    onClick={() => handleNavLinkClick("/tentang")}
                                    className={`text-white blue-hover d-flex align-items-center me-3 ${activeLink === '/tentang' ? 'active' : ''}`}
                                    href="/tentang"
                                >
                                    <FaInfoCircle className="me-2" /> Tentang
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>

                        {/* <button
                            onClick={() => handleNavLinkClick("/login")} // Use handleNavLinkClick
                            className="btn btn-primary fw-bold d-flex align-items-center"
                            type="button"

                        >
                            <IoLogIn className="me-2" /> Login Admin
                        </button> */}
                    </div>

                </Container>
            </Navbar>
        </>
    );
}

export default Header;
