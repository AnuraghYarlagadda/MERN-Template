import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { Bounce } from "react-toastify"; //add if required  Slide, Zoom, Flip,
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2/dist/sweetalert2.all.min.js";
import "sweetalert2/src/sweetalert2.scss";

const Alert = ({ alerts }) => {
  if (alerts !== null && alerts.length > 0) {
    alerts.map((alert) => {
      if (alert.alertType === "info") return toast.info(alert.message);
      else if (alert.alertType === "success")
        return toast.success(alert.message);
      else if (alert.alertType === "warning") return toast.warn(alert.message);
      else if (alert.alertType === "error")
        return Swal.fire({
          title: "Error!",
          text: alert.message,
          icon: "error",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        });
      else if (alert.alertType === "dark") return toast.dark(alert.message);
      else return toast(alert.message);
    });
  }
  return (
    <ToastContainer pauseOnFocusLoss={false} limit={2} transition={Bounce} />
  );
};

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);
