import PropTypes from "prop-types";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import SelectedBusContext from "../context/selectedbus";

const BusDetail = ({ bus }) => {
  let navigate = useNavigate();
  const { setSelectedBus } = useContext(SelectedBusContext);

  function taketoAnotherPage() {
    localStorage.setItem(
      "busListDetails",
      JSON.stringify({
        busList: JSON.parse(localStorage.getItem("busListDetails")).busList,
        selectedBus: bus,
      })
    );
    setSelectedBus(bus);
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
      <p className="bus-price">Rs.{bus.basePrice ?? 0}/-</p>
    </div>
  );
};

export default BusDetail;

BusDetail.propTypes = {
  bus: PropTypes.object.isRequired,
};
