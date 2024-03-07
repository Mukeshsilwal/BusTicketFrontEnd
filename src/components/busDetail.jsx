import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const BusDetail = ({ bus }) => {
  let navigate = useNavigate();

  function taketoAnotherPage() {
    navigate("/ticket-details");
  }
  return (
    <div className={`bus-detail`} onClick={taketoAnotherPage}>
      <p className="bus-name">
        <b>{bus.busName}</b>
      </p>
      <p className="bus-type">
        <i>{bus.busType}</i>
      </p>
      <p className="bus-departure-time">
        <b>{new Date(bus.departureDateTime).toLocaleTimeString()}</b>
      </p>
      <p className="bus-price">Rs.{bus.price}/-</p>
    </div>
  );
};

export default BusDetail;

BusDetail.propTypes = {
  bus: PropTypes.object.isRequired,
};
