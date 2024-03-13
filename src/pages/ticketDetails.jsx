import { useContext, useEffect, useState } from "react";
import NavigationBar from "../components/Navbar";
import SelectedBusContext from "../context/selectedbus";

export default function TicketDetails() {
  const { selectedBus } = useContext(SelectedBusContext);
  console.log("selectedBus", selectedBus);
  // const seatPrices = selectedBus.seats.map(seat => )
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleContactChange = (e) => {
    setContact(e.target.value);
  };

  const [availableSeats, setAvailableSeats] = useState(
    selectedBus.seats
      .filter((seat) => !seat.reserved)
      .map((seat) => seat.seatNumber)
  );
  const [totalCost, setTotalCost] = useState(0);
  console.log("availableSeats", availableSeats);

  function generateRandomId() {
    const idLength = 10;
    const characters = "0123456789";
    let randomId = "";

    for (let i = 0; i < idLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomId += characters[randomIndex];
    }

    return randomId;
  }
  async function esewaPaymentCall(sig, tid) {
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
    const path = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    const form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", path);

    for (const key in formData) {
      const hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", formData[key]);
      form.appendChild(hiddenField);
    }

    document.body.appendChild(form);

    // generate booking id
    let bookingId = "";
    const bookingRes = await fetch("http://localhost:8089/booking/post", {
      body: JSON.stringify({
        fullName: name,
        email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (bookingRes.ok) {
      const data = await bookingRes.json();
      // console.log(data);
      bookingId = data.bookingId;
      localStorage.setItem("bookingRes", JSON.stringify(data))
    }

    // send backend request to create ticket for all seats
    for (const seatName of selectedSeats) {
      const seatId = selectedBus.seats.find(
        (seat) => seat.seatNumber === seatName
      ).id;

      // request to create ticket for seat
      const seatRes = await fetch(
        `http://localhost:8089/tickets/seat/${seatId}/book/${bookingId}`,
        {
          body: JSON.stringify({}),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        }
      );

      if (seatRes.ok) {
        const data = await seatRes.json();
        localStorage.setItem("seatRes", JSON.stringify(data))
        console.log(data);
      }

      // confirm booking
      const confirmRes = await fetch(
        `http://localhost:8089/bookSeats/${seatId}`,
        {
          body: JSON.stringify({}),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        }
      );

      
      if (confirmRes.ok) {
        const data = await confirmRes.json();
        console.log(data);
      }
    }

    form.submit();
  }

  async function bookTicket() {
    if (!selectedSeats.length) {
      alert("No seat selected!");
      return;
    }
    if (!name) {
      alert("Enter passenger name!");
      return;
    }
    if (!email) {
      alert("Enter passenger email!");
      return;
    }
    if (!contact) {
      alert("Enter passenger contact number!");
      return;
    }
    // const amt = calcTotalCost();
    const tid = generateRandomId();
    const response = await fetch(
      `http://localhost:8089/secret/generateSignature?total_cost=${totalCost}&transaction_uuid=${tid}`
    );
    let sig = "";
    if (response) {
      sig = await response.text();
      await esewaPaymentCall(sig, tid);
    }
    // esewaPaymentCall();
  }

  function calcTotalCost() {
    let totalC = 0;
    for (const seat of selectedBus.seats) {
      if (selectedSeats.includes(seat.seatNumber)) {
        totalC += parseInt(seat.price);
      }
    }
    setTotalCost(totalC);
  }
  useEffect(() => {
    calcTotalCost();
  }, [selectedSeats]);

  return (
    <div className="ticket-details-container">
      <NavigationBar />

      <div className="all-details">
        <div className="left-details">
          <h2>Passenger Details</h2>
          <div className="passenger-details">
            <div className="passenger-details-item">
              <label htmlFor="passenger-name">Passenger Name</label>
              <input
                type="text"
                name="passenger-name"
                onChange={handleNameChange}
              />
            </div>
            <div className="passenger-details-item">
              <label htmlFor="passenger-email">Email</label>
              <input
                type="text"
                name="passenger-email"
                onChange={handleEmailChange}
              />
            </div>
            <div className="passenger-details-item">
              <label htmlFor="passenger-contact">Contact</label>
              <input
                type="number"
                name="passenger-contact"
                onChange={handleContactChange}
              />
            </div>
          </div>

          <h2>Select Seats</h2>
          <div className="seat-selection-div">
            <div className="seat-selection">
              <div className="seats">
                <div
                  className={`seat${
                    selectedSeats.includes("B2") ? " selected " : ""
                  }${availableSeats.includes("B2") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("B2")) {
                      setSelectedSeats([...selectedSeats, "B2"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "B2"),
                      ]);
                    }
                  }}
                >
                  B2
                  <br />
                  {availableSeats.includes("B2") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "B2"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("B4") ? " selected " : ""
                  }${availableSeats.includes("B4") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("B4")) {
                      setSelectedSeats([...selectedSeats, "B4"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "B4"),
                      ]);
                    }
                  }}
                >
                  B4
                  <br />
                  {availableSeats.includes("B4") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "B4"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("B6") ? " selected " : ""
                  }${availableSeats.includes("B6") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("B6")) {
                      setSelectedSeats([...selectedSeats, "B6"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "B6"),
                      ]);
                    }
                  }}
                >
                  B6
                  <br />
                  {availableSeats.includes("B6") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "B6"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("B8") ? " selected " : ""
                  }${availableSeats.includes("B8") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("B8")) {
                      setSelectedSeats([...selectedSeats, "B8"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "B8"),
                      ]);
                    }
                  }}
                >
                  B8
                  <br />
                  {availableSeats.includes("B8") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "B8"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("B10") ? " selected " : ""
                  }${availableSeats.includes("B10") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("B10")) {
                      setSelectedSeats([...selectedSeats, "B10"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "B10"),
                      ]);
                    }
                  }}
                >
                  B10
                  <br />
                  {availableSeats.includes("B10") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "B10"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("B12") ? " selected " : ""
                  }${availableSeats.includes("B12") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("B12")) {
                      setSelectedSeats([...selectedSeats, "B12"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "B12"),
                      ]);
                    }
                  }}
                >
                  B12
                  <br />
                  {availableSeats.includes("B12") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "B12"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("B14") ? " selected " : ""
                  }${availableSeats.includes("B14") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("B14")) {
                      setSelectedSeats([...selectedSeats, "B14"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "B14"),
                      ]);
                    }
                  }}
                >
                  B14
                  <br />
                  {availableSeats.includes("B14") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "B14"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("B16") ? " selected " : ""
                  }${availableSeats.includes("B16") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("B16")) {
                      setSelectedSeats([...selectedSeats, "B16"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "B16"),
                      ]);
                    }
                  }}
                >
                  B16
                  <br />
                  {availableSeats.includes("B16") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "B16"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
              </div>
              <div className="seats">
                <div
                  className={`seat${
                    selectedSeats.includes("B1") ? " selected " : ""
                  }${availableSeats.includes("B1") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("B1")) {
                      setSelectedSeats([...selectedSeats, "B1"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "B1"),
                      ]);
                    }
                  }}
                >
                  B1
                  <br />
                  {availableSeats.includes("B1") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "B1"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("B3") ? " selected " : ""
                  }${availableSeats.includes("B3") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("B3")) {
                      setSelectedSeats([...selectedSeats, "B3"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "B3"),
                      ]);
                    }
                  }}
                >
                  B3
                  <br />
                  {availableSeats.includes("B3") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "B3"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("B5") ? " selected " : ""
                  }${availableSeats.includes("B5") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("B5")) {
                      setSelectedSeats([...selectedSeats, "B5"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "B5"),
                      ]);
                    }
                  }}
                >
                  B5
                  <br />
                  {availableSeats.includes("B5") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "B5"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("B7") ? " selected " : ""
                  }${availableSeats.includes("B7") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("B7")) {
                      setSelectedSeats([...selectedSeats, "B7"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "B7"),
                      ]);
                    }
                  }}
                >
                  B7
                  <br />
                  {availableSeats.includes("B7") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "B7"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("B9") ? " selected " : ""
                  }${availableSeats.includes("B9") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("B9")) {
                      setSelectedSeats([...selectedSeats, "B9"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "B9"),
                      ]);
                    }
                  }}
                >
                  B9
                  <br />
                  {availableSeats.includes("B9") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "B9"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("B11") ? " selected " : ""
                  }${availableSeats.includes("B11") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("B11")) {
                      setSelectedSeats([...selectedSeats, "B11"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "B11"),
                      ]);
                    }
                  }}
                >
                  B11
                  <br />
                  {availableSeats.includes("B11") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "B11"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("B13") ? " selected " : ""
                  }${availableSeats.includes("B13") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("B13")) {
                      setSelectedSeats([...selectedSeats, "B13"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "B13"),
                      ]);
                    }
                  }}
                >
                  B13
                  <br />
                  {availableSeats.includes("B13") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "B13"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("B15") ? " selected " : ""
                  }${availableSeats.includes("B15") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("B15")) {
                      setSelectedSeats([...selectedSeats, "B15"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "B15"),
                      ]);
                    }
                  }}
                >
                  B15
                  <br />
                  {availableSeats.includes("B15") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "B15"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
              </div>
              <div className="seats-reverse">
                <div
                  className={`seat${
                    selectedSeats.includes("B17") ? " selected " : ""
                  }${availableSeats.includes("B17") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("B17")) {
                      setSelectedSeats([...selectedSeats, "B17"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "B17"),
                      ]);
                    }
                  }}
                >
                  B17
                  <br />
                  {availableSeats.includes("B17") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "B17"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
              </div>
              <div className="seats">
                <div
                  className={`seat${
                    selectedSeats.includes("A2") ? " selected " : ""
                  }${availableSeats.includes("A2") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("A2")) {
                      setSelectedSeats([...selectedSeats, "A2"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "A2"),
                      ]);
                    }
                  }}
                >
                  A2
                  <br />
                  {availableSeats.includes("A2") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "A2"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("A4") ? " selected " : ""
                  }${availableSeats.includes("A4") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("A4")) {
                      setSelectedSeats([...selectedSeats, "A4"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "A4"),
                      ]);
                    }
                  }}
                >
                  A4
                  <br />
                  {availableSeats.includes("A4") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "A4"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("A6") ? " selected " : ""
                  }${availableSeats.includes("A6") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("A6")) {
                      setSelectedSeats([...selectedSeats, "A6"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "A6"),
                      ]);
                    }
                  }}
                >
                  A6
                  <br />
                  {availableSeats.includes("A6") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "A6"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("A8") ? " selected " : ""
                  }${availableSeats.includes("A8") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("A8")) {
                      setSelectedSeats([...selectedSeats, "A8"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "A8"),
                      ]);
                    }
                  }}
                >
                  A8
                  <br />
                  {availableSeats.includes("A8") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "A8"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("A10") ? " selected " : ""
                  }${availableSeats.includes("A10") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("A10")) {
                      setSelectedSeats([...selectedSeats, "A10"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "A10"),
                      ]);
                    }
                  }}
                >
                  A10
                  <br />
                  {availableSeats.includes("A10") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "A10"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("A12") ? " selected " : ""
                  }${availableSeats.includes("A12") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("A12")) {
                      setSelectedSeats([...selectedSeats, "A12"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "A12"),
                      ]);
                    }
                  }}
                >
                  A12
                  <br />
                  {availableSeats.includes("A12") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "A12"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("A14") ? " selected " : ""
                  }${availableSeats.includes("A14") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("A14")) {
                      setSelectedSeats([...selectedSeats, "A14"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "A14"),
                      ]);
                    }
                  }}
                >
                  A14
                  <br />
                  {availableSeats.includes("A14") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "A14"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("A16") ? " selected " : ""
                  }${availableSeats.includes("A16") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("A16")) {
                      setSelectedSeats([...selectedSeats, "A16"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "A16"),
                      ]);
                    }
                  }}
                >
                  A16
                  <br />
                  {availableSeats.includes("A16") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "A16"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
              </div>
              <div className="seats">
                <div
                  className={`seat${
                    selectedSeats.includes("A1") ? " selected " : ""
                  }${availableSeats.includes("A1") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("A1")) {
                      setSelectedSeats([...selectedSeats, "A1"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "A1"),
                      ]);
                    }
                  }}
                >
                  A1
                  <br />
                  {availableSeats.includes("A1") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "A1"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("A3") ? " selected " : ""
                  }${availableSeats.includes("A3") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("A3")) {
                      setSelectedSeats([...selectedSeats, "A3"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "A3"),
                      ]);
                    }
                  }}
                >
                  A3
                  <br />
                  {availableSeats.includes("A3") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "A3"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("A5") ? " selected " : ""
                  }${availableSeats.includes("A5") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("A5")) {
                      setSelectedSeats([...selectedSeats, "A5"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "A5"),
                      ]);
                    }
                  }}
                >
                  A5
                  <br />
                  {availableSeats.includes("A5") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "A5"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("A7") ? " selected " : ""
                  }${availableSeats.includes("A7") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("A7")) {
                      setSelectedSeats([...selectedSeats, "A7"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "A7"),
                      ]);
                    }
                  }}
                >
                  A7
                  <br />
                  {availableSeats.includes("A7") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "A7"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("A9") ? " selected " : ""
                  }${availableSeats.includes("A9") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("A9")) {
                      setSelectedSeats([...selectedSeats, "A9"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "A9"),
                      ]);
                    }
                  }}
                >
                  A9
                  <br />
                  {availableSeats.includes("A9") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "A9"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("A11") ? " selected " : ""
                  }${availableSeats.includes("A11") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("A11")) {
                      setSelectedSeats([...selectedSeats, "A11"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "A11"),
                      ]);
                    }
                  }}
                >
                  A11
                  <br />
                  {availableSeats.includes("A11") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "A11"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("A13") ? " selected " : ""
                  }${availableSeats.includes("A13") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("A13")) {
                      setSelectedSeats([...selectedSeats, "A13"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "A13"),
                      ]);
                    }
                  }}
                >
                  A13
                  <br />
                  {availableSeats.includes("A13") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "A13"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
                <div
                  className={`seat${
                    selectedSeats.includes("A15") ? " selected " : ""
                  }${availableSeats.includes("A15") ? " available " : ""}`}
                  onClick={() => {
                    if (!selectedSeats.includes("A15")) {
                      setSelectedSeats([...selectedSeats, "A15"]);
                    } else {
                      setSelectedSeats([
                        ...selectedSeats.filter((seat) => seat !== "A15"),
                      ]);
                    }
                  }}
                >
                  A15
                  <br />
                  {availableSeats.includes("A15") && (
                    <span>
                      {selectedBus.seats.find(
                        (seat) => seat.seatNumber === "A15"
                      )?.price ?? ""}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="seat-info">
              <label htmlFor="available-seat">Available</label>
              <div className="seat available" name="available-seat"></div>
              <label htmlFor="booked-seat">Booked</label>
              <div className="seat" name="booked-seat"></div>
            </div>
          </div>

          <button onClick={bookTicket}>Pay with esewa</button>
        </div>

        <div className="right-details">
          <h2>Route Details</h2>
          <div className="route-details">
            <p>
              Route: {selectedBus.route12.sourceBusStop.name} -{" "}
              {selectedBus.route12.destinationBusStop.name}
            </p>
            <p>
              Date:{" "}
              {new Date(selectedBus.departureDateTime).toLocaleDateString()}
            </p>
            <p>Seats: {selectedSeats.join(",")}</p>
            <p>Travel: {selectedBus.busName}</p>
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
