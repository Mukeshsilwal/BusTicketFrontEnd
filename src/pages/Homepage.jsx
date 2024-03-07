import NavigationBar from "../components/Navbar";
import ImageSearchComponent from "../components/ImageSearchComponent";

// HomePage component
export default function HomePage() {
  return (
    <div className="flex-column h-screen w-screen overflow-auto pt-4">
      <NavigationBar />
      <ImageSearchComponent />
    </div>
  );
}
