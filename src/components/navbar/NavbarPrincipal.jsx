import React from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link } from "react-router-dom";
import { SearchModal } from "./SearchModal";
import { useState, useRef } from "react";
import { CartOffCanvas } from "./CartOffcanvas";
import { logoutUser } from "../../redux/slices/userSlice";
import { emptyCart } from "../../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import axios from "axios";
import "./css/style.css";

export const NavbarPrincipal = () => {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const user = useSelector((state) => state.user.user);
  const cart = useSelector((state) => state.cart.cart);
  const [openModalSearch, setOpenModalSearch] = useState(false);
  const [openOffcanvas, setOpenOffcanvas] = useState(false);
  const [show, setShow] = useState(false);
  const [showCanvasNavbar, setShowCanvasNavbar] = useState(false);
  const [target, setTarget] = useState(null);
  const [userError, setUserError] = useState("");
  const MySwal = withReactContent(Swal);
  let total = 0;

  cart.map((item) => {
    total += item.quantity;
  });

  function handlerMsgErr() {
    MySwal.fire({
      title: "Warning!",
      text: "This functionality escapes from the scope of the project.",
      icon: "warning",
      confirmButtonText: "Cancel",
      confirmButtonColor: "#f8bb86",
    });
  }

  const handleClick = (event) => {
    setShow(!show);
    setTarget(event.target);
  };

  async function handlerLogout() {
    try {
      const response = await axios({
        method: "post",
        url: `${process.env.REACT_APP_DB_HOST}/logout`,
        headers: { Authorization: `Bearer ${user.token}` },
      });
      dispatch(logoutUser());
      dispatch(emptyCart());
    } catch (error) {
      setUserError(error.response.data.error);
    }
  }

  return (
    <>
      <header className="main-header-area sticky-top navbarPrincipal">
        <div className="header-middle">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-12">
                <Navbar expand="md" key="md" className="mb-3">
                  <Container fluid className="p-0 align-items-end">
                    <Navbar.Brand>
                      <div className="logoDiv">
                        <Link to="/" className="header-logo">
                          <img src="../../hackshop.png" alt="Header Logo" id="imgLogoPage" />
                        </Link>
                      </div>
                    </Navbar.Brand>
                    <Navbar.Toggle onClick={() => setShowCanvasNavbar((prev) => !prev)} />
                    <Navbar.Offcanvas
                      show={showCanvasNavbar}
                      onHide={() => setShowCanvasNavbar(false)}
                      id={`offcanvasNavbar-expand-md`}
                      aria-labelledby={`offcanvasNavbarLabel-expand-md`}
                      placement="start"
                    >
                      <Offcanvas.Header closeButton></Offcanvas.Header>
                      <Offcanvas.Body>
                        <Nav className="justify-content-md-center flex-grow-1 pe-3 main-nav">
                          <ul id="navbarMenuBtns">
                            <li className="drop-holder navbarMenuLi">
                              <Link to="/">Home</Link>
                            </li>
                            <li className="megamenu-holder navbarMenuLi">
                              <Link to="/products">Shop</Link>
                            </li>
                            <li className="navbarMenuLi">
                              <Link to="/aboutus">About Us</Link>
                            </li>
                            <li
                              className="contactUs navbarMenuLi"
                              onClick={() => {
                                handlerMsgErr();
                              }}
                            >
                              Contact Us
                            </li>
                            <li className="navbarMenuLi">
                              <Link to="/account">
                                {user && <p className="userNav">{user.firstname}</p>}
                              </Link>
                            </li>
                          </ul>
                        </Nav>
                        <div className="header-right d-flex align-items-end">
                          <ul className="m-0">
                            <li>
                              <button
                                className="search-btn bt"
                                type="button"
                                onClick={() => {
                                  setOpenModalSearch(true);
                                }}
                              >
                                <i className="pe-7s-search"></i>
                              </button>
                              {openModalSearch ? (
                                <SearchModal setOpenModalSearch={setOpenModalSearch} />
                              ) : null}
                            </li>
                            <li className="dropdown">
                              <div ref={ref}>
                                <Button
                                  className="btn btn-link dropdown-toggle ht-btn p-0"
                                  id="btnProfileIcon"
                                  onClick={handleClick}
                                >
                                  <i className="pe-7s-users" id="btnUsersProfile"></i>
                                </Button>

                                <Overlay
                                  show={show}
                                  target={target}
                                  placement="bottom"
                                  container={ref}
                                  containerPadding={20}
                                >
                                  <Popover id="popover-contained">
                                    {!user ? (
                                      <>
                                        <Link className="dropdown-item" to="/register">
                                          Register
                                        </Link>
                                        <Link className="dropdown-item" to="/login">
                                          Login
                                        </Link>
                                      </>
                                    ) : (
                                      <>
                                        <Link className="dropdown-item" to="/account">
                                          My account
                                        </Link>
                                        <Link
                                          className="dropdown-item"
                                          to="/login"
                                          onClick={() => handlerLogout()}
                                        >
                                          Logout
                                        </Link>
                                      </>
                                    )}
                                  </Popover>
                                </Overlay>
                              </div>
                            </li>
                            <li
                              className="whishlist"
                              onClick={() => {
                                handlerMsgErr();
                              }}
                              style={{ color: "#212529" }}
                            >
                              <i className="pe-7s-like"></i>
                            </li>
                            <li className="minicart-wrap me-3 me-lg-0">
                              <button
                                className="minicart-btn toolbar-btn btnOffcanvas"
                                type="button"
                                onClick={() => {
                                  setOpenOffcanvas(true);
                                }}
                              >
                                <i className="pe-7s-shopbag"></i>
                                <span className="quantity" id="numberCartShop">
                                  {total < 10 ? total : "9+"}
                                </span>
                              </button>
                              {openOffcanvas ? (
                                <CartOffCanvas setOpenOffcanvas={setOpenOffcanvas} />
                              ) : null}
                            </li>
                          </ul>
                        </div>
                      </Offcanvas.Body>
                    </Navbar.Offcanvas>
                  </Container>
                </Navbar>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
