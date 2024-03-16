import { useEffect, useState } from "react";
import NavigationBar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function AdminPanel() {
  // Get today's date in the format YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();

  const [busStop, setBusStop] = useState(null);
  function handleBusStopChange(e) {
    setBusStop(e.target.value);
  }
  async function createBusStop() {
    if (!busStop) {
      toast.error("Bus Stop name cannot be empty!");
      return;
    }
    const url = `http://localhost:8089/admin/post`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ name: busStop }),
    });

    console.log("createBusStop", res);
    if (res.ok) {
      toast.success("Bus Stop created!");
    } else {
      if (res.status === 401) {
        alert("Session time out. Login again!");
        navigate("/admin/login");
      }
      toast.error("Error while creating Bus Stop. Please Retry!");
    }
  }

  const [busStops, setBusStops] = useState(null);
  const [routeCityOne, setRouteCityOne] = useState(null);
  const [routeCityTwo, setRouteCityTwo] = useState(null);
  async function getBusStops() {
    const busStopRes = await fetch("http://localhost:8089/busStop/get");
    if (busStopRes.ok) {
      const busStops = await busStopRes.json();
      console.log(busStops);
      setBusStops(busStops);
    }
  }
  function handleRouteCityOneChange(e) {
    setRouteCityOne(e.target.value);
  }
  function handleRouteCityTwoChange(e) {
    setRouteCityTwo(e.target.value);
  }
  async function createRoute() {
    console.log("createRoute", { routeCityOne, routeCityTwo });

    if (!routeCityOne || !routeCityTwo) {
      toast.error("Fill both the routes!");
      return;
    }

    const id = busStops.find((city) => city.name === routeCityOne).id;
    const id1 = busStops.find((city) => city.name === routeCityTwo).id;
    const url = `http://localhost:8089/admin/busStopRoute/${id}/${id1}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({}),
    });

    console.log("createRoute", res);
    if (res.ok) {
      toast.success("New Route created!");
    } else {
      if (res.status === 401) {
        alert("Session time out. Login again!");
        navigate("/admin/login");
        toast.error("Error while creating new route. Please Retry!");
      }
    }
  }

  const [busName, setBusName] = useState(null);
  const [busRoute, setBusRoute] = useState(null);
  const [busDate, setBusDate] = useState(null);
  const [allRoutes, setAllRoutes] = useState(null);
  const [basePrice, setBasePrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [busTime, setBusTime] = useState(null);
  async function getAllRoutes() {
    const allroutesRes = await fetch("http://localhost:8089/route/get");
    if (allroutesRes.ok) {
      const allRoutesLoad = await allroutesRes.json();
      console.log(allRoutesLoad);
      setAllRoutes(allRoutesLoad);
    }
  }
  function handleBusNameChange(e) {
    setBusName(e.target.value);
  }
  function handleBusRouteChange(e) {
    setBusRoute(e.target.value);
  }
  function handleMaxPriceChange(e) {
    setMaxPrice(e.target.value);
  }
  function handleBasePriceChange(e) {
    setBasePrice(e.target.value);
  }
  console.log("createNewBus", {
    busName,
    busRoute,
    busDate,
    busTime,
    maxPrice,
    basePrice,
    departureDateTime:
      busDate + "T" + busTime?.split(":")?.[0] + ":"+busTime?.split(":")?.[1],
  });
  async function createNewBus() {
    if (!busName) {
      toast.error("Bus Name cannot be empty!");
      return;
    }
    if (!busRoute) {
      toast.error("Bus Route cannot be empty!");
      return;
    }
    if (!busDate) {
      toast.error("Bus Date cannot be empty!");
      return;
    }
    if (!maxPrice) {
      toast.error("Max Price cannot be empty!");
      return;
    }
    if (!basePrice) {
      toast.error("Base Price  cannot be empty!");
      return;
    }
    if (!busTime) {
      toast.error("Bus Time cannot be empty!");
      return;
    }

    const url = `http://localhost:8089/admin/routeBus/${busRoute}`;
    const busRouteRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        busName,
        busType: "Deluxe",
        departureDateTime:
          busDate + "T" + busTime.split(":")[0] + ":" + busTime.split(":")[1],
        date: busDate,
        maxPrice,
        basePrice,
      }),
    });

    console.log("createBus", busRouteRes);
    if (busRouteRes.ok) {
      toast.success("New Bus created!");
    } else {
      if (busRouteRes.status === 401) {
        alert("Session time out. Login again!");
        navigate("/admin/login");
        toast.error("Error while creating new bus. Please Retry!");
      }
    }
  }

  const [seatNumber, setSeatNumber] = useState(null);
  const [seatBusId, setSeatBusId] = useState(null);
  const [allBuses, setAllBuses] = useState(null);
  async function getAllBuses() {
    const allBusesRes = await fetch("http://localhost:8089/bus/route");
    if (allBusesRes.ok) {
      const allBusesLoad = await allBusesRes.json();
      console.log(allBusesLoad);
      setAllBuses(allBusesLoad);
    }
  }
  function handleSeatBusChange(e) {
    setSeatBusId(e.target.value);
  }
  function handleSeatNumberChange(e) {
    setSeatNumber(e.target.value);
  }
  async function createNewSeat() {
    if (!seatNumber) {
      toast.error("Seat Name cannot be empty!");
      return;
    }
    if (!seatBusId) {
      toast.error("Bus ID cannot be empty!");
      return;
    }
    console.log("createNewSeat", { seatNumber, seatBusId });
    const url = "http://localhost:8089/admin/postSeat/" + seatBusId;
    const seatRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        seatNumber,
        reserved: false,
      }),
    });

    console.log("createNewSeat", seatRes);
    if (seatRes.ok) {
      toast.success("New Seat added!");
    } else {
      if (seatRes.status === 401) {
        alert("Session time out. Login again!");
        navigate("/admin/login");
        toast.error("Error while creating new seat. Please Retry!");
      }
    }
  }
  console.log("allBuses", allBuses);
  console.log("busStops", busStops);
  useEffect(() => {
    getBusStops();
    getAllRoutes();
    getAllBuses();
    if (!localStorage.getItem("token")) {
      navigate("/admin/login");
    }
  }, []);
  return (
    <div>
      <NavigationBar />
      <div className="flex-column w-full h-fit p-10 mt-10">
        <div className="flex-column mb-5">
          <p className="text-2xl text-green-400">Create New Bus Stop</p>
          <div className="flex gap-5">
            <input
              onChange={handleBusStopChange}
              type="text"
              placeholder="Name of Bus Stop eg. Kathmandu"
              className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
            />

            <button
              className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
              onClick={createBusStop}
            >
              Submit
            </button>
          </div>
        </div>

        {busStops && (
          <div className="flex-column mb-5">
            <p className="text-2xl text-green-400">Create New Route</p>
            <div className="flex gap-5">
              <select
                onChange={handleRouteCityOneChange}
                className="w-full m-2 p-2 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              >
                <option value="">Select source</option>
                {busStops.map((city) => (
                  <option
                    key={city.name}
                    value={city.name}
                    onChange={() => setRouteCityOne(city.name)}
                  >
                    {city.name}
                  </option>
                ))}
              </select>

              <select
                onChange={handleRouteCityTwoChange}
                className="w-full m-2 p-2 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              >
                <option value="">Select source</option>
                {busStops.map((city) => (
                  <option
                    key={city.name}
                    value={city.name}
                    onChange={() => setRouteCityTwo(city.name)}
                  >
                    {city.name}
                  </option>
                ))}
              </select>
              <button
                className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
                onClick={createRoute}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {allRoutes && (
          <div className="flex-column mb-5">
            <p className="text-2xl text-green-400">Create New Bus</p>
            <div className="flex gap-5">
              <input
                onChange={handleBusNameChange}
                type="text"
                placeholder="Name of Bus"
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
              <input
                onChange={handleMaxPriceChange}
                type="number"
                placeholder="Max Price"
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
              <input
                onChange={handleBasePriceChange}
                type="number"
                placeholder="Base Price"
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
              <select
                onChange={handleBusRouteChange}
                className="w-full m-2 p-2 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              >
                <option value="">Select Route</option>
                {allRoutes.map((route) => (
                  <option
                    key={route.id}
                    value={route.id}
                    onChange={() => setBusRoute(route.id)}
                  >
                    {route.sourceBusStop.name} {" - "}
                    {route.destinationBusStop.name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                placeholder="Date"
                value={busDate}
                onChange={(e) => setBusDate(e.target.value)}
                min={today}
                className="block w-full m-2 p-2 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
              <input
                type="time"
                step="1"
                value={busTime}
                className="block w-full m-2 p-2 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                placeholder="Time"
                onChange={(e) => setBusTime(e.target.value)}
              />
              <button
                className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
                onClick={createNewBus}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {allBuses && (
          <div className="flex-column mb-5">
            <p className="text-2xl text-green-400">Create New Seat</p>
            <div className="flex gap-5">
              <input
                onChange={handleSeatNumberChange}
                type="text"
                placeholder="Seat Number eg. A12"
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />

              <select
                onChange={handleSeatBusChange}
                className="w-full m-2 p-2 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              >
                <option value="">Select Bus</option>
                {allBuses.map((bus) => (
                  <option
                    key={bus.id}
                    value={bus.id}
                    onChange={() => setSeatBusId(bus.id)}
                  >
                    {bus.busName}
                  </option>
                ))}
              </select>
              <button
                className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
                onClick={createNewSeat}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
