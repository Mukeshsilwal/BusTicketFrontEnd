import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageSearchComponent.css";
import axiosInstance from "../functions";
import BusListContext from "../context/busdetails";

const ImageSearchComponent = () => {
  let navigate = useNavigate();

  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [date, setDate] = useState("");
  const { setBusList } = useContext(BusListContext);
  const [busStops, setBusStops] = useState([]);

  const handleSourceChange = (e) => {
    setSource(e.target.value);
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  const handleSearch = async () => {
    // taketoAnotherPage();
    const response = await axiosInstance.get(
      `http://localhost:8089/bus/search?source=${source}&destination=${destination}&date=${date}`
    );
    if (response.data) {
      console.log(response.data);
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
      // return response.data;
    }
  };

  // Get today's date in the format YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  async function getBusStops() {
    const busStopRes = await fetch("http://localhost:8089/busStop/get");
    if (busStopRes.ok) {
      const busStops = await busStopRes.json();
      console.log(busStops);
      setBusStops(busStops);
    }
  }

  useEffect(() => {
    getBusStops();
  }, []);
  return (
    <div className="flex h-full pt-8 bg-cyan-700">
      {busStops.length > 0 && (
        <>
          <div className="image-container">
            <img
              src="https://img.freepik.com/premium-vector/simple-buss-traansportation-logo-design_569344-386.jpg?w=2000"
              alt="Image"
            />
          </div>
          <div className="w-2/5 flex-col self-center justify-self-center">
            <select  onChange={handleSourceChange} className="w-7/10 m-2 p-2">
              <option value="">Select source</option>
              {busStops.map((city) => (
                <option
                  key={city.name}
                  value={city.name}
                  onChange={() => setSource(city.name)}
                >
                  {city.name}
                </option>
              ))}
            </select>
            <select
              onChange={handleDestinationChange}
              className="w-7/10 m-2 p-2"
            >
              <option value="">Select destination</option>
              {busStops.map((city) => (
                <option
                  key={city.name}
                  value={city.name}
                  onChange={() => setDestination(city.name)}
                >
                  {city.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              placeholder="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={today}
              className="block w-7/10 m-2 p-2"
            />
            <button
              onClick={handleSearch}
              className="px-5 py-3 border-none bg-black text-white cursor-pointer"
            >
              Search
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageSearchComponent;
