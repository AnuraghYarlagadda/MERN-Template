import React, { Fragment, useState } from "react";
import { Route, Switch, Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import PropTypes from "prop-types";
import { AiFillProfile, AiFillFileAdd } from "react-icons/ai";
import { MdDashboard } from "react-icons/md";
import { RiAccountCircleLine } from "react-icons/ri";
import { IoMdGitCompare } from "react-icons/io";
import {
  FaSignOutAlt,
  FaSignInAlt,
  FaUserAlt,
  FaChartBar,
} from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import {
  Collapse,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Swal from "sweetalert2/dist/sweetalert2.all.min.js";
import "sweetalert2/src/sweetalert2.scss";

import Landing from "./Landing";
import Routes from "../routing/Routes";

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-danger m-2",
    cancelButton: "btn btn-success m-2",
  },
  buttonsStyling: false,
});

const NavBar = ({ auth: { isAuthenticated, loading, user }, logout }) => {
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(false);
  const toggleLeft = () => setIsLeftOpen(!isLeftOpen);
  const toggleRight = () => setIsRightOpen(!isRightOpen);
  const authLinks = (
    <Nav className="ml-auto" navbar>
      <NavItem className="active">
        <NavLink href="/dashboard">
          <MdDashboard size="1.3rem" /> Dashboard
        </NavLink>
      </NavItem>
      <UncontrolledDropdown nav inNavbar>
        <DropdownToggle nav caret style={{ color: "#fff" }}>
          <RiAccountCircleLine size="1.3rem" color="#fff" />{" "}
          {user ? `${user.name}` : ``}
        </DropdownToggle>
        <DropdownMenu right style={{ backgroundColor: "#f1f1f1" }}>
          <DropdownItem>
            <Link className="link" to="/editProfile">
              <AiFillProfile size="1.3rem" /> <span>Edit Profile</span>
            </Link>
          </DropdownItem>
          <DropdownItem>
            <Link className="link" to="/changePassword">
              <BsFillShieldLockFill size="1.3rem" />{" "}
              <span>Change Password</span>
            </Link>
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem
            onClick={() =>
              swalWithBootstrapButtons
                .fire({
                  title: "Are you sure?",
                  text: "Do you want to Logout?",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: "Yes, Logout!",
                  cancelButtonText: "No, Stay here!",
                  reverseButtons: true,
                })
                .then((result) => {
                  if (result.value) {
                    logout();
                  } else {
                    Swal.fire({
                      icon: "error",
                      title: "Log-Out cancelled!",
                      text: "Welcome Back 😃",
                    });
                  }
                })
            }
            href="#"
          >
            <FaSignOutAlt /> Logout
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </Nav>
  );
  const guestLinks = (
    <ul className="nav navbar-nav ml-auto">
      <li className="nav-item active">
        <NavLink href="/register">
          <FaUserAlt size="1.2rem" /> Register
        </NavLink>
      </li>
      <li className="nav-item active">
        <NavLink href="/login">
          <FaSignInAlt size="1.3rem" /> Login
        </NavLink>
      </li>
    </ul>
  );
  return (
    <div>
      <div className="wrapper d-flex align-items-stretch">
        {!loading && (
          <Fragment>
            {isAuthenticated && (
              <nav id="sidebar" className={isLeftOpen ? "active" : ""}>
                <h1>
                  <Link to="/" className="logo">
                    <span className="fa fa-home"></span>
                  </Link>
                </h1>
                <ul className="list-unstyled components mb-5">
                  <li>
                    <Link to="/fileUpload">
                      <span>
                        <AiFillFileAdd size="1.5rem" />
                      </span>{" "}
                      File Upload
                    </Link>
                  </li>
                  <li>
                    <Link to="/charts">
                      <span>
                        <FaChartBar size="1.5rem" />
                      </span>{" "}
                      Charts
                    </Link>
                  </li>
                  <li className="submenu">
                    <a
                      href="chartsSubMenu"
                      rel="noopener noreferrer"
                      data-toggle="collapse"
                      aria-expanded="false"
                      className="dropdown-toggle"
                    >
                      <span>
                        <FaChartBar size="1.5rem" />
                      </span>{" "}
                      Charts
                    </a>
                    <ul className="collapse list-unstyled" id="chartsSubMenu">
                      <li>
                        <Link to="/charts">
                          <span>
                            <FaChartBar size="1.5rem" />
                          </span>{" "}
                          Charts
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
                {/* Footer for Sidebar */}
                {/* <div className="footer">
                   <p>
                   </p>
                 </div> */}
              </nav>
            )}
          </Fragment>
        )}

        <div
          id="content"
          className={!loading ? (isAuthenticated ? "p-4 p-md-5" : "") : ""}
        >
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark text-white">
            <div className="container-fluid">
              {!loading && (
                <Fragment>
                  {isAuthenticated && (
                    <button
                      type="button"
                      id="sidebarCollapse"
                      className="btn btn-primary"
                      onClick={toggleLeft}
                    >
                      <IoMdGitCompare size="1.5rem" />
                      <span className="sr-only">Toggle Menu</span>
                    </button>
                  )}
                </Fragment>
              )}

              <NavbarToggler onClick={toggleRight} />
              <Collapse isOpen={isRightOpen} navbar>
                {!loading && (
                  <Fragment>
                    {isAuthenticated ? authLinks : guestLinks}
                  </Fragment>
                )}
              </Collapse>
            </div>
          </nav>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route component={Routes} />
          </Switch>
        </div>
      </div>
    </div>
  );
};

NavBar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(NavBar);
