import PropTypes from "prop-types";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import SelectedBusContext from "../context/selectedbus";

const BusDetail = ({ bus }) => {
  const navigate = useNavigate();
  const { setSelectedBus } = useContext(SelectedBusContext);

  const handleClick = () => {
    localStorage.setItem(
      "busListDetails",
      JSON.stringify({
        busList: JSON.parse(localStorage.getItem("busListDetails")).busList,
        selectedBus: bus,
      })
    );
    setSelectedBus(bus);
    navigate("/ticket-details");
  };

  return (
    <div
      className="bus-detail bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-100"
      onClick={handleClick}
    >
      <div className="flex justify-between items-center mb-4">
        <p className="bus-name text-xl font-bold text-gray-800">
          {bus.busName}
        </p>
        <p className="bus-type text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
          {bus.busType}
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="bus-departure-time text-lg font-semibold text-gray-700">
          Departure:{" "}
          <span className="text-blue-600">
            {new Date(bus.departureDateTime).toLocaleTimeString()}
          </span>
        </p>
      </div>

      <div className="flex justify-between items-center">
        <p className="bus-price text-xl font-bold text-green-600">
          Rs. {bus.basePrice ?? 0}/-
        </p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
          onClick={handleClick}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default BusDetail;

BusDetail.propTypes = {
  bus: PropTypes.object.isRequired,
};