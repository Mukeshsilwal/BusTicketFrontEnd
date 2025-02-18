import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../functions";
import BusListContext from "../context/busdetails";

const ImageSearchComponent = () => {
  const navigate = useNavigate();
  const { setBusList } = useContext(BusListContext);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [busStops, setBusStops] = useState([]);
  const today = new Date().toISOString().split("T")[0];

  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(
        `https://busticketingsystem-1.onrender.com/bus/search?source=${source}&destination=${destination}&date=${date}`
      );
      
      if (response.data) {
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

  useEffect(() => {
    const getBusStops = async () => {
      try {
        const response = await fetch("https://busticketingsystem-1.onrender.com/busStop/get");
        if (response.ok) {
          const data = await response.json();
          setBusStops(data);
        }
      } catch (error) {
        console.error("Failed to fetch bus stops:", error);
      }
    };
    getBusStops();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-600 to-blue-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden transform transition-all duration-500 hover:scale-102">
        <div className="md:w-1/2 p-8 flex items-center justify-center bg-blue-50">
          <img
            src="https://img.freepik.com/premium-vector/simple-buss-traansportation-logo-design_569344-386.jpg?w=2000"
            alt="Bus travel"
            className="rounded-lg shadow-md w-full h-64 object-contain transform transition-all duration-500 hover:scale-105"
          />
        </div>

        <div className="md:w-1/2 p-8 space-y-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center animate-pulse">
            Find Your Bus
          </h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <select
                onChange={(e) => setSource(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <select
                onChange={(e) => setDestination(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Travel Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={!source || !destination || !date}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg 
                        transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
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