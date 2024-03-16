import PropTypes from "prop-types";
import { useContext, useState } from "react";
import BusDetail from "../components/busDetail";
import NavigationBar from "../components/Navbar";
import BusListContext from "../context/busdetails";

const BusList = () => {
  const { busList: buses } = useContext(BusListContext);
  const [filters, setFilters] = useState({
    maxPrice: Infinity,
    busType: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(filteredBuses.length / itemsPerPage);
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const filteredBuses = buses.filter((bus) => {
    const avPrice = bus.seats.length > 0 ? 
      bus.seats.reduce((acc, curr) => {
        return acc + curr.price;
      }, 0) / bus.seats.length 
      : 0;
    return (
      (filters.maxPrice === "" || (avPrice ?? 0) <= filters.maxPrice) &&
      (filters.busType === "" || bus.busType === filters.busType)
    );
  });

  const indexOfLastBus = currentPage * itemsPerPage;
  const indexOfFirstBus = indexOfLastBus - itemsPerPage;
  const currentBuses = filteredBuses.slice(indexOfFirstBus, indexOfLastBus);

  // const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bus-list-main">
      <NavigationBar />
      <div className="bus-list-container">
        <div className="bus-filters">
          <h2>Filters</h2>
          <div className={`bus-filter-pagination`}>
            <button className="pagination-btn">Next</button>
            <button className="pagination-btn">Previous</button>
          </div>
          <div className="filter-item">
            <label>Max Price </label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-item">
            <label>Bus Type </label>
            <select
              name="busType"
              value={filters.busType}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Luxury">Luxury</option>
              <option value="Standard">Standard</option>
            </select>
          </div>
        </div>

        <div className="bus-details">
          <h2>Bus List</h2>
          <div className={`bus-list-pagination`}>
            <button className="pagination-btn" onClick={handleNextPage}>
              Next
            </button>
            <button className="pagination-btn" onClick={handlePreviousPage}>
              Previous
            </button>
          </div>

          <div className={`bus-detail-header`}>
            <p className="bus-name">Travels</p>
            <p className="bus-type">Bus Type</p>
            <p className="bus-departure-time">Departure</p>
            <p className="bus-price">Starting Fare</p>
          </div>
          <ul>
            {currentBuses.map((bus) => (
              <BusDetail bus={bus} key={bus.id} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

BusList.propTypes = {
  buses: PropTypes.array.isRequired,
};

export default BusList;
