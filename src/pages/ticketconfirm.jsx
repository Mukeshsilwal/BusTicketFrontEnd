import { useEffect, useState } from "react";
import NavigationBar from "../components/Navbar";

const TicketConfirmed = () => {
  const [pdfUrl, setPdfUrl] = useState(null);

  async function fetchPdf() {
    try {
      const response = await fetch(
        "http://localhost:8089/tickets/generate?ticketId=1"
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
