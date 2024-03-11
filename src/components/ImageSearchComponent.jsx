import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageSearchComponent.css";
import axiosInstance from "../functions";
import BusListContext from "../context/busdetails";

const nepalCities = [
  "Kathmandu",
  "Pokhara",
  "Biratnagar",
  "Lalitpur",
  "Bharatpur",
  "Birgunj",
  "Dharan",
  "Bhaktapur",
  "Janakpur",
  "Butwal",
];

const ImageSearchComponent = () => {
  let navigate = useNavigate();

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const { setBusList } = useContext(BusListContext);

  const handleSourceChange = (e) => {
    setSource(e.target.value);
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  const handleSearch = async () => {
    // taketoAnotherPage();
    const response = await axiosInstance.get(
      `http://localhost:8089/bus/search?source=${source}&destination=${destination}`
    );
    if (response.data) {
      console.log(response.data);
      setBusList(response.data);
      navigate("/buslist");
      // return response.data;
    }
  };

  // Get today's date in the format YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex h-full pt-8 bg-cyan-700">
      <div className="image-container">
        <img
          src="https://img.freepik.com/premium-vector/simple-buss-traansportation-logo-design_569344-386.jpg?w=2000"
          alt="Image"
        />
      </div>
      <div className="w-2/5 flex-col self-center justify-self-center">
        <select onChange={handleSourceChange} className="w-7/10 m-2 p-2">
          <option value="">Select source</option>
          {nepalCities.map((city) => (
            <option key={city} value={city} onChange={() => setSource(city)}>
              {city}
            </option>
          ))}
        </select>
        <select onChange={handleDestinationChange} className="w-7/10 m-2 p-2">
          <option value="">Select destination</option>
          {nepalCities.map((city) => (
            <option
              key={city}
              value={city}
              onChange={() => setDestination(city)}
            >
              {city}
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
    </div>
  );
};

export default ImageSearchComponent;
