import { useEffect, useState } from "react";
import NavigationBar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApiService from "../services/api.service";
import API_CONFIG from "../config/api";


export function AdminPanel() {
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();

  const [busStop, setBusStop] = useState("");
  const [busStops, setBusStops] = useState([]);
  const [routeCityOne, setRouteCityOne] = useState("");
  const [routeCityTwo, setRouteCityTwo] = useState("");
  const [busName, setBusName] = useState("");
  const [busRoute, setBusRoute] = useState("");
  const [busDate, setBusDate] = useState("");
  const [allRoutes, setAllRoutes] = useState([]);
  const [basePrice, setBasePrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [busTime, setBusTime] = useState("");
  const [seatNumber, setSeatNumber] = useState("");
  const [seatBusId, setSeatBusId] = useState("");
  const [allBuses, setAllBuses] = useState([]);

  // Fetch bus stops, routes, and buses on component mount
  useEffect(() => {
    getBusStops();
    getAllRoutes();
    getAllBuses();
    if (!localStorage.getItem("token")) {
      navigate("/admin/login");
    }
  }, []);

 async function getBusStops() {
    try {
      const busStopRes = await ApiService.get(API_CONFIG.ENDPOINTS.GET_BUS_STOPS);
      if (busStopRes.ok) {
        const busStops = await busStopRes.json();
        setBusStops(busStops);
      }
    } catch (error) {
      console.error("Error fetching bus stops:", error);
    }
  }

  // Fetch all routes
  async function getAllRoutes() {
    const allroutesRes = await ApiService.get(API_CONFIG.ENDPOINTS.GET_ROUTES);
    if (allroutesRes.ok) {
      const allRoutesLoad = await allroutesRes.json();
      setAllRoutes(allRoutesLoad);
    }
  }

  // Fetch all buses
  async function getAllBuses() {
    const allBusesRes = await ApiService.get(API_CONFIG.ENDPOINTS.GET_ALL_BUSES);
    if (allBusesRes.ok) {
      const allBusesLoad = await allBusesRes.json();
      setAllBuses(allBusesLoad);
    }
  }

  // Create a new bus stop
  async function createBusStop() {
    if (!busStop) {
      toast.error("Bus Stop name cannot be empty!");
      return;
    }

    try {
      const res = await ApiService.post(API_CONFIG.ENDPOINTS.CREATE_BUS_STOP, {
        name: busStop,
      });

      if (res.ok) {
        toast.success("Bus Stop created!");
        setBusStop("");
        getBusStops();
      } else {
        if (res.status === 401) {
          toast.error("Session timeout. Login again!");
          navigate("/admin/login");
        } else {
          toast.error("Error while creating Bus Stop. Please Retry!");
        }
      }
    } catch (error) {
      console.error("Error creating bus stop:", error);
      toast.error("Failed to create bus stop");
    }
  }
  // Create a new route
 async function createRoute() {
    if (!routeCityOne || !routeCityTwo) {
      toast.error("Fill both the routes!");
      return;
    }

    try {
      const id = busStops.find((city) => city.name === routeCityOne).id;
      const id1 = busStops.find((city) => city.name === routeCityTwo).id;
      
      const res = await ApiService.post(
        `${API_CONFIG.ENDPOINTS.CREATE_ROUTE}/${id}/${id1}`,
        {}
      );

      if (res.ok) {
        toast.success("New Route created!");
        setRouteCityOne("");
        setRouteCityTwo("");
        getAllRoutes();
      } else {
        if (res.status === 401) {
          toast.error("Session timeout. Login again!");
          navigate("/admin/login");
        } else {
          toast.error("Error while creating new route. Please Retry!");
        }
      }
    } catch (error) {
      console.error("Error creating route:", error);
      toast.error("Failed to create route");
    }
  }

  // Create a new bus
 async function createNewBus() {
    if (!busName || !busRoute || !busDate || !maxPrice || !basePrice || !busTime) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const busRouteRes = await ApiService.post(
        `${API_CONFIG.ENDPOINTS.CREATE_BUS}/${busRoute}`,
        {
          busName,
          busType: "Deluxe",
          departureDateTime: `${busDate}T${busTime}`,
          date: busDate,
          maxPrice,
          basePrice,
        }
      );

      if (busRouteRes.ok) {
        toast.success("New Bus created!");
        setBusName("");
        setBusRoute("");
        setBusDate("");
        setMaxPrice("");
        setBasePrice("");
        setBusTime("");
        getAllBuses();
      } else {
        if (busRouteRes.status === 401) {
          toast.error("Session timeout. Login again!");
          navigate("/admin/login");
        } else {
          toast.error("Error while creating new bus. Please Retry!");
        }
      }
    } catch (error) {
      console.error("Error creating bus:", error);
      toast.error("Failed to create bus");
    }
  }

  // Create a new seat
   async function createNewSeat() {
    if (!seatNumber || !seatBusId) {
      toast.error("Seat Number and Bus ID are required!");
      return;
    }

    try {
      const seatRes = await ApiService.post(
        `${API_CONFIG.ENDPOINTS.CREATE_SEAT}/${seatBusId}`,
        {
          seatNumber,
          reserved: false,
        }
      );

      if (seatRes.ok) {
        toast.success("New Seat added!");
        setSeatNumber("");
        setSeatBusId("");
        getAllBuses();
      } else {
        if (seatRes.status === 401) {
          toast.error("Session timeout. Login again!");
          navigate("/admin/login");
        } else {
          toast.error("Error while creating new seat. Please Retry!");
        }
      }
    } catch (error) {
      console.error("Error creating seat:", error);
      toast.error("Failed to create seat");
    }
  }


  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationBar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Panel</h1>

        {/* Create New Bus Stop */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Create New Bus Stop</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Name of Bus Stop (e.g., Kathmandu)"
              value={busStop}
              onChange={(e) => setBusStop(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={createBusStop}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create
            </button>
          </div>
        </div>

        {/* Create New Route */}
        {busStops.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Create New Route</h2>
            <div className="flex gap-4">
              <select
                value={routeCityOne}
                onChange={(e) => setRouteCityOne(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Source</option>
                {busStops.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              <select
                value={routeCityTwo}
                onChange={(e) => setRouteCityTwo(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Destination</option>
                {busStops.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              <button
                onClick={createRoute}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        )}

        {/* Create New Bus */}
        {allRoutes.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Create New Bus</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Bus Name"
                value={busName}
                onChange={(e) => setBusName(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Base Price"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={busRoute}
                onChange={(e) => setBusRoute(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Route</option>
                {allRoutes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.sourceBusStop.name} - {route.destinationBusStop.name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={busDate}
                onChange={(e) => setBusDate(e.target.value)}
                min={today}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="time"
                value={busTime}
                onChange={(e) => setBusTime(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={createNewBus}
                className="col-span-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Bus
              </button>
            </div>
          </div>
        )}

        {/* Create New Seat */}
        {allBuses.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Create New Seat</h2>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Seat Number (e.g., A12)"
                value={seatNumber}
                onChange={(e) => setSeatNumber(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={seatBusId}
                onChange={(e) => setSeatBusId(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Bus</option>
                {allBuses.map((bus) => (
                  <option key={bus.id} value={bus.id}>
                    {bus.busName}
                  </option>
                ))}
              </select>
              <button
                onClick={createNewSeat}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Seat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}