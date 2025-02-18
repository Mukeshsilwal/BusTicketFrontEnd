import NavigationBar from "../components/Navbar";
import ImageSearchComponent from "../components/ImageSearchComponent";

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-auto bg-gray-100">
      <NavigationBar />
      <div className="flex-grow flex items-center justify-center p-4">
        <ImageSearchComponent />
      </div>
    </div>
  );
}
