import PropTypes from "prop-types";
import { useState } from "react";
import BusDetail from "../components/busDetail";
import NavigationBar from "../components/Navbar";

const buses = [
  {
    id: 1,
    busName: "Everest Express",
    busType: "Deluxe",
    price: 1200.0,
    departureDateTime: "2024-03-01T08:00:00",
    source: "Kathmandu",
    destination: "Everest Base Camp",
    route12: {
      id: 1,
      fro: "Kathmandu",
      too: "Everest Base Camp",
      date: "2024-03-01",
      weight: 5,
      distance: 350.8,
      sourceBusStop: {
        id: 1,
        name: "Kathmandu Bus Station",
        distance: 0,
        visited: true,
      },
      destinationBusStop: {
        id: 2,
        name: "Everest Base Camp Bus Station",
        distance: 350.8,
        visited: false,
      },
    },
  },
  {
    id: 2,
    busName: "Annapurna Explorer",
    busType: "Luxury",
    price: 1500.0,
    departureDateTime: "2024-03-02T09:30:00",
    source: "Pokhara",
    destination: "Annapurna Base Camp",
    route12: {
      id: 2,
      fro: "Pokhara",
      too: "Annapurna Base Camp",
      date: "2024-03-02",
      weight: 4,
      distance: 280.4,
      sourceBusStop: {
        id: 3,
        name: "Pokhara Bus Terminal",
        distance: 0,
        visited: true,
      },
      destinationBusStop: {
        id: 4,
        name: "Annapurna Base Camp Bus Station",
        distance: 280.4,
        visited: false,
      },
    },
  },
  {
    id: 3,
    busName: "Lumbini Express",
    busType: "Standard",
    price: 800.0,
    departureDateTime: "2024-03-03T10:00:00",
    source: "Bhairahawa",
    destination: "Lumbini",
    route12: {
      id: 3,
      fro: "Bhairahawa",
      too: "Lumbini",
      date: "2024-03-03",
      weight: 3,
      distance: 65.2,
      sourceBusStop: {
        id: 5,
        name: "Bhairahawa Bus Terminal",
        distance: 0,
        visited: true,
      },
      destinationBusStop: {
        id: 6,
        name: "Lumbini Bus Station",
        distance: 65.2,
        visited: false,
      },
    },
  },
  {
    id: 4,
    busName: "Chitwan Safari",
    busType: "Deluxe",
    price: 1300.0,
    departureDateTime: "2024-03-04T07:45:00",
    source: "Kathmandu",
    destination: "Chitwan",
    route12: {
      id: 4,
      fro: "Kathmandu",
      too: "Chitwan",
      date: "2024-03-04",
      weight: 5,
      distance: 200.6,
      sourceBusStop: {
        id: 7,
        name: "Kathmandu Bus Station",
        distance: 0,
        visited: true,
      },
      destinationBusStop: {
        id: 8,
        name: "Chitwan Bus Station",
        distance: 200.6,
        visited: false,
      },
    },
  },
  {
    id: 5,
    busName: "Birgunj Commuter",
    busType: "Standard",
    price: 700.0,
    departureDateTime: "2024-03-05T11:15:00",
    source: "Kathmandu",
    destination: "Birgunj",
    route12: {
      id: 5,
      fro: "Kathmandu",
      too: "Birgunj",
      date: "2024-03-05",
      weight: 2,
      distance: 120.3,
      sourceBusStop: {
        id: 9,
        name: "Kathmandu Bus Station",
        distance: 0,
        visited: true,
      },
      destinationBusStop: {
        id: 10,
        name: "Birgunj Bus Station",
        distance: 120.3,
        visited: false,
      },
    },
  },
  {
    id: 6,
    busName: "Janakpur Shuttle",
    busType: "Standard",
    price: 750.0,
    departureDateTime: "2024-03-06T10:30:00",
    source: "Kathmandu",
    destination: "Janakpur",
    route12: {
      id: 6,
      fro: "Kathmandu",
      too: "Janakpur",
      date: "2024-03-06",
      weight: 3,
      distance: 180.2,
      sourceBusStop: {
        id: 11,
        name: "Kathmandu Bus Station",
        distance: 0,
        visited: true,
      },
      destinationBusStop: {
        id: 12,
        name: "Janakpur Bus Station",
        distance: 180.2,
        visited: false,
      },
    },
  },
  {
    id: 7,
    busName: "Butwal Express",
    busType: "Deluxe",
    price: 1400.0,
    departureDateTime: "2024-03-07T08:45:00",
    source: "Kathmandu",
    destination: "Butwal",
    route12: {
      id: 7,
      fro: "Kathmandu",
      too: "Butwal",
      date: "2024-03-07",
      weight: 4,
      distance: 220.7,
      sourceBusStop: {
        id: 13,
        name: "Kathmandu Bus Station",
        distance: 0,
        visited: true,
      },
      destinationBusStop: {
        id: 14,
        name: "Butwal Bus Station",
        distance: 220.7,
        visited: false,
      },
    },
  },
  {
    id: 8,
    busName: "Dharan Commuter",
    busType: "Standard",
    price: 750.0,
    departureDateTime: "2024-03-08T09:00:00",
    source: "Biratnagar",
    destination: "Dharan",
    route12: {
      id: 8,
      fro: "Biratnagar",
      too: "Dharan",
      date: "2024-03-08",
      weight: 2,
      distance: 95.4,
      sourceBusStop: {
        id: 15,
        name: "Biratnagar Bus Terminal",
        distance: 0,
        visited: true,
      },
      destinationBusStop: {
        id: 16,
        name: "Dharan Bus Station",
        distance: 95.4,
        visited: false,
      },
    },
  },
  {
    id: 9,
    busName: "Bhaktapur Shuttle",
    busType: "Standard",
    price: 700.0,
    departureDateTime: "2024-03-09T10:15:00",
    source: "Kathmandu",
    destination: "Bhaktapur",
    route12: {
      id: 9,
      fro: "Kathmandu",
      too: "Bhaktapur",
      date: "2024-03-09",
      weight: 1,
      distance: 20.1,
      sourceBusStop: {
        id: 17,
        name: "Kathmandu Bus Station",
        distance: 0,
        visited: true,
      },
      destinationBusStop: {
        id: 18,
        name: "Bhaktapur Bus Station",
        distance: 20.1,
        visited: false,
      },
    },
  },
  {
    id: 10,
    busName: "Bharatpur Express",
    busType: "Deluxe",
    price: 1350.0,
    departureDateTime: "2024-03-10T07:30:00",
    source: "Kathmandu",
    destination: "Bharatpur",
    route12: {
      id: 10,
      fro: "Kathmandu",
      too: "Bharatpur",
      date: "2024-03-10",
      weight: 3,
      distance: 120.9,
      sourceBusStop: {
        id: 19,
        name: "Kathmandu Bus Station",
        distance: 0,
        visited: true,
      },
      destinationBusStop: {
        id: 20,
        name: "Bharatpur Bus Station",
        distance: 120.9,
        visited: false,
      },
    },
  },
  {
    id: 11,
    busName: "Nagarkot Shuttle",
    busType: "Standard",
    price: 700.0,
    departureDateTime: "2024-03-11T09:45:00",
    source: "Kathmandu",
    destination: "Nagarkot",
    route12: {
      id: 11,
      fro: "Kathmandu",
      too: "Nagarkot",
      date: "2024-03-11",
      weight: 2,
      distance: 40.5,
      sourceBusStop: {
        id: 21,
        name: "Kathmandu Bus Station",
        distance: 0,
        visited: true,
      },
      destinationBusStop: {
        id: 22,
        name: "Nagarkot Bus Station",
        distance: 40.5,
        visited: false,
      },
    },
  },
  {
    id: 12,
    busName: "Dhulikhel Commuter",
    busType: "Standard",
    price: 750.0,
    departureDateTime: "2024-03-12T10:30:00",
    source: "Kathmandu",
    destination: "Dhulikhel",
    route12: {
      id: 12,
      fro: "Kathmandu",
      too: "Dhulikhel",
      date: "2024-03-12",
      weight: 2,
      distance: 30.8,
      sourceBusStop: {
        id: 23,
        name: "Kathmandu Bus Station",
        distance: 0,
        visited: true,
      },
      destinationBusStop: {
        id: 24,
        name: "Dhulikhel Bus Station",
        distance: 30.8,
        visited: false,
      },
    },
  },
  {
    id: 13,
    busName: "Sauraha Safari",
    busType: "Deluxe",
    price: 1400.0,
    departureDateTime: "2024-03-13T07:45:00",
    source: "Kathmandu",
    destination: "Sauraha",
    route12: {
      id: 13,
      fro: "Kathmandu",
      too: "Sauraha",
      date: "2024-03-13",
      weight: 4,
      distance: 185.7,
      sourceBusStop: {
        id: 25,
        name: "Kathmandu Bus Station",
        distance: 0,
        visited: true,
      },
      destinationBusStop: {
        id: 26,
        name: "Sauraha Bus Station",
        distance: 185.7,
        visited: false,
      },
    },
  },
  {
    id: 14,
    busName: "Gorkha Shuttle",
    busType: "Standard",
    price: 700.0,
    departureDateTime: "2024-03-14T08:30:00",
    source: "Kathmandu",
    destination: "Gorkha",
    route12: {
      id: 14,
      fro: "Kathmandu",
      too: "Gorkha",
      date: "2024-03-14",
      weight: 2,
      distance: 150.2,
      sourceBusStop: {
        id: 27,
        name: "Kathmandu Bus Station",
        distance: 0,
        visited: true,
      },
      destinationBusStop: {
        id: 28,
        name: "Gorkha Bus Station",
        distance: 150.2,
        visited: false,
      },
    },
  },
  {
    id: 15,
    busName: "Biratnagar Commuter",
    busType: "Standard",
    price: 750.0,
    departureDateTime: "2024-03-15T09:00:00",
    source: "Biratnagar",
    destination: "Dharan",
    route12: {
      id: 15,
      fro: "Biratnagar",
      too: "Dharan",
      date: "2024-03-15",
      weight: 2,
      distance: 95.4,
      sourceBusStop: {
        id: 29,
        name: "Biratnagar Bus Terminal",
        distance: 0,
        visited: true,
      },
      destinationBusStop: {
        id: 30,
        name: "Dharan Bus Station",
        distance: 95.4,
        visited: false,
      },
    },
  },
];
const BusList = () => {
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
    return (
      (filters.maxPrice === "" || bus.price <= filters.maxPrice) &&
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
          <label>Max Price:</label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-item">
          <label>Bus Type:</label>
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
          <p className="bus-price">Fare</p>
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
