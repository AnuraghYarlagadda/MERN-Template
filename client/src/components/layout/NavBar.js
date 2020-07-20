import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import PropTypes from "prop-types";
import { AiOutlineHome, AiFillProfile } from "react-icons/ai";
import { MdDashboard } from "react-icons/md";
import { RiAccountCircleLine } from "react-icons/ri";
import { FaSignOutAlt, FaSignInAlt, FaUserAlt } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
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

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-danger m-2",
    cancelButton: "btn btn-success m-2",
  },
  buttonsStyling: false,
});

const NavBar = ({ auth: { isAuthenticated, loading, user }, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const authLinks = (
    <Nav className="ml-auto" navbar>
      <NavItem>
        <NavLink href="/dashboard">
          <MdDashboard size="1.3rem" /> Dashboard
        </NavLink>
      </NavItem>
      <UncontrolledDropdown nav inNavbar>
        <DropdownToggle nav caret>
          <RiAccountCircleLine size="1.3rem" /> {user ? `${user.name}` : ``}
        </DropdownToggle>
        <DropdownMenu right style={{ backgroundColor: "#f1f1f1" }}>
          <DropdownItem href="/editProfile">
            <AiFillProfile size="1.2rem" /> Edit Profile
          </DropdownItem>
          <DropdownItem href="/changePassword">
            <BsFillShieldLockFill size="1.2rem" /> Change Password
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
    <Nav className="ml-auto" navbar>
      <NavItem>
        <NavLink href="/register">
          <FaUserAlt size="1.2rem" /> Register
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/login">
          <FaSignInAlt size="1.3rem" /> Login
        </NavLink>
      </NavItem>
    </Nav>
  );
  return (
    <div>
      <Navbar color="dark" dark expand="sm" className="mb-5">
        <NavbarBrand href="/">
          <AiOutlineHome size="1.5rem" /> Project
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          {!loading && (
            <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
          )}
        </Collapse>
      </Navbar>
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
