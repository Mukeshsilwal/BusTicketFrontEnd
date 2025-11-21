import { useContext, useEffect, useState } from "react";
import NavigationBar from "../components/Navbar";
import SelectedBusContext from "../context/selectedbus";
import API_CONFIG from "../config/api";
import ApiService from "../services/api.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function TicketDetails() {
  const { selectedBus } = useContext(SelectedBusContext);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [totalCost, setTotalCost] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const total = selectedSeats.reduce((acc, seatNum) => {
      const seat = selectedBus.seats.find((s) => s.seatNumber === seatNum);
      return acc + (seat ? parseInt(seat.price) : 0);
    }, 0);

    setTotalCost(total);
  }, [selectedSeats, selectedBus.seats]);

  function generateRandomId() {
    return Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");
  }

  async function esewaPaymentCall(sig, tid, bookingId) {
    const formData = {
      amount: totalCost,
      failure_url: "http://localhost:3000/booking-failed",
      product_delivery_charge: "0",
      product_service_charge: "0",
      product_code: "EPAYTEST",
      signature: sig,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      success_url: "http://localhost:3000/ticket-confirm",
      tax_amount: "0",
      total_amount: totalCost,
      transaction_uuid: tid,
      secret: "8gBm/:&EnhH.1/q",
    };

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    Object.entries(formData).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);

    // ------------------------------
    // BOOK SEATS (uses ApiService)
    // ------------------------------
    const seatResponses = [];
    const bookedSeats = [];

    for (const seatNum of selectedSeats) {
      const seat = selectedBus.seats.find((s) => s.seatNumber === seatNum);
      if (!seat) continue;

      try {
        // save booking seat
        const seatRes = await ApiService.post(
          `${API_CONFIG.ENDPOINTS.BOOK_TICKET}/${seat.id}/book/${bookingId}`,
          {}
        );

        if (seatRes.ok) {
          const data = await seatRes.json();
          seatResponses.push(data);
          bookedSeats.push(seatNum);
        }

        // confirm seat booking
        await ApiService.post(
          `${API_CONFIG.ENDPOINTS.BOOK_SEAT}/${seat.id}`,
          {}
        );
      } catch (err) {
        console.error("Seat booking error:", err);
      }
    }

    localStorage.setItem("seatRes", JSON.stringify(seatResponses));
    localStorage.setItem("selectedSeats", JSON.stringify(bookedSeats));

    form.submit();
  }

  async function bookTicket() {
    if (!selectedSeats.length) return toast.error("No seat selected!");
    if (!name) return toast.error("Enter passenger name!");
    if (!email) return toast.error("Enter passenger email!");
    if (!contact) return toast.error("Enter passenger contact number!");

    const tid = generateRandomId();

    // ------------------------------
    // CREATE BOOKING
    // ------------------------------
    let bookingId = "";
    try {
      const bookingRes = await ApiService.post(
        API_CONFIG.ENDPOINTS.CREATE_BOOKING,
        { fullName: name, email }
      );

      if (!bookingRes.ok) {
        toast.error("Failed to create booking!");
        return;
      }

      const data = await bookingRes.json();
      bookingId = data.bookingId;

      localStorage.setItem("bookingRes", JSON.stringify(data));
    } catch (err) {
      toast.error("Booking API error!");
      return;
    }

    // ------------------------------
    // GET SIGNATURE FOR ESEWA
    // ------------------------------
    try {
      const sigRes = await ApiService.get(
        `${API_CONFIG.ENDPOINTS.GENERATE_SIGNATURE}?total_cost=${totalCost}&transaction_uuid=${tid}`
      );

      if (!sigRes.ok) {
        toast.error("Failed to generate eSewa signature!");
        return;
      }

      const signature = await sigRes.text();
      localStorage.setItem("email", email);

      await esewaPaymentCall(signature, tid, bookingId);
    } catch (err) {
      toast.error("Signature API error!");
    }
  }

  return (
    <div className="ticket-details-container">
      <NavigationBar />

      <div className="all-details">
        <div className="left-details">
          <h2>Passenger Details</h2>

          <div className="passenger-details">
            <div className="passenger-details-item">
              <label>Passenger Name</label>
              <input type="text" onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="passenger-details-item">
              <label>Email</label>
              <input type="text" onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="passenger-details-item">
              <label>Contact</label>
              <input type="number" onChange={(e) => setContact(e.target.value)} />
            </div>
          </div>

          <h2>Select Seats</h2>

          <div className="seat-selection-div">
            <div className="seat-selection">
              {selectedBus.seats.map((seat) => {
                const isSelected = selectedSeats.includes(seat.seatNumber);
                const isAvailable = !seat.reserved;

                return (
                  <div
                    key={seat.id}
                    className={`seat${
                      isSelected ? " selected" : ""
                    }${isAvailable ? " available" : ""}`}
                    onClick={() => {
                      if (!isAvailable) return;
                      if (!isSelected) {
                        setSelectedSeats([...selectedSeats, seat.seatNumber]);
                      } else {
                        setSelectedSeats(
                          selectedSeats.filter((s) => s !== seat.seatNumber)
                        );
                      }
                    }}
                  >
                    {seat.seatNumber}
                    <br />
                    {isAvailable && <span>{seat.price}</span>}
                  </div>
                );
              })}
            </div>

            <div className="seat-info">
              <label>Available</label>
              <div className="seat available"></div>
              <label>Booked</label>
              <div className="seat"></div>
            </div>
          </div>

          <button onClick={bookTicket}>Pay with eSewa</button>
        </div>

        <div className="right-details">
          <h2>Route Details</h2>
          <div className="route-details">
            <p>
              Route: {selectedBus.route12?.sourceBusStop?.name} –{" "}
              {selectedBus.route12?.destinationBusStop?.name}
            </p>

            <p>
              Date:{" "}
              {new Date(selectedBus.departureDateTime).toLocaleDateString()}
            </p>

            <p>Seats: {selectedSeats.join(", ")}</p>
            <p>Bus: {selectedBus.busName}</p>
          </div>

          <h2>Payment Details</h2>
          <div className="payment-details">
            <p>Total Cost: {totalCost}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
