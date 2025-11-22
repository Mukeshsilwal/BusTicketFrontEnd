import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../functions";
import BusListContext from "../context/busdetails";
import Apiservice from "../services/api.service";
import API_CONFIG from "../config/api.config";

const ImageSearchComponent = () => {
  const navigate = useNavigate();
  const { setBusList } = useContext(BusListContext);

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [busStops, setBusStops] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  // ⭐ Search buses using API service
  const handleSearch = async () => {
    try {
      const response = await Apiservice.get(
        `${API_CONFIG.ENDPOINTS.SEARCH_BUSES}?source=${source}&destination=${destination}&date=${date}`
      );

      if (response && response.data) {
        localStorage.setItem(
          "searchDetails",
          JSON.stringify({ source, destination, date })
        );

        localStorage.setItem(
          "busListDetails",
          JSON.stringify({ busList: response.data })
        );

        setBusList(response.data);

        navigate("/buslist");
      }
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  // ⭐ Load all bus stops
  useEffect(() => {
    const getBusStops = async () => {
      try {
        const response = await Apiservice.get(
          API_CONFIG.ENDPOINTS.GET_ALL_BUSES
        );

        setBusStops(response.data || []);
      } catch (error) {
        console.error("Failed to fetch bus stops:", error);
      }
    };

    getBusStops();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-600 to-blue-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        
        {/* Image Section */}
        <div className="md:w-1/2 p-8 flex items-center justify-center bg-blue-50">
          <img
            src="https://img.freepik.com/premium-vector/simple-buss-traansportation-logo-design_569344-386.jpg?w=2000"
            alt="Bus travel"
            className="rounded-lg shadow-md w-full h-64 object-contain"
          />
        </div>

        {/* Search Form */}
        <div className="md:w-1/2 p-8 space-y-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
            Find Your Bus
          </h1>

          <div className="space-y-4">
            {/* Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <select
                onChange={(e) => setSource(e.target.value)}
                className="w-full p-3 border rounded-lg"
                value={source}
              >
                <option value="">Select source city</option>
                {busStops.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <select
                onChange={(e) => setDestination(e.target.value)}
                className="w-full p-3 border rounded-lg"
                value={destination}
              >
                <option value="">Select destination city</option>
                {busStops.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Travel Date
              </label>
              <input
                type="date"
                value={date}
                min={today}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            {/* Button */}
            <button
              onClick={handleSearch}
              disabled={!source || !destination || !date}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
            >
              Search Buses
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ImageSearchComponent;
