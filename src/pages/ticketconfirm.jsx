import { useEffect, useState } from "react";
import NavigationBar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TicketConfirmed = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const navigate = useNavigate();

  async function fetchPdf() {
    const ticketId = JSON.parse(localStorage.getItem("seatRes"));
    console.log(ticketId);
    try {
      const response = await fetch(
        "https://busticketingsystem-1.onrender.com/tickets/generate?ticketId=" + ticketId.ticketNo
      );
      if (!response.ok) {
        throw new Error("Failed to fetch PDF");
      }
      const blob = await response.blob();
      console.log(blob);
      const url = URL.createObjectURL(blob);
      console.log(url);
      setPdfUrl(url);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  }

  async function cancelTicket() {
    const selectedBus = JSON.parse(localStorage.getItem("busListDetails")).selectedBus;
    const seatNumber = JSON.parse(localStorage.getItem("selectedSeats"))[0];
    const seatId = selectedBus.seats.find(
      (seat) => seat.seatNumber === seatNumber
    ).id;
    const email = localStorage.getItem("email");
    const ticketId = JSON.parse(localStorage.getItem("seatRes")).ticketNo;
    console.log(seatId);
    try {
      const response = await fetch(
        `https://busticketingsystem-1.onrender.com/bookSeats/${seatId}?email=${email}&ticketNo=${ticketId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        toast.success("Ticket Cancelled.");
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  }

  return (
    <div className="flex-column h-screen w-screen overflow-auto pt-4 justify-center">
      <NavigationBar />

      <div style={{ width: "100%", height: "500px", marginTop: "3em" }}>
        {!pdfUrl && (
          <button onClick={fetchPdf} className="pagination-btn">
            View Ticket
          </button>
        )}
        {pdfUrl && (
          <button onClick={cancelTicket} className="pagination-btn">
            Cancel Ticket
          </button>
        )}
        {pdfUrl && (
          <embed
            src={pdfUrl}
            type="application/pdf"
            width="100%"
            height="100%"
          />
        )}
      </div>
    </div>
  );
};

export default TicketConfirmed;
