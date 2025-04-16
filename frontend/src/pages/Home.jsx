import Navbar from "../components/Navbar";

const Home = () => {
  console.log("🏠 Home Page Rendering");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="text-center mt-20 px-4">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Welcome to the Online Voting System
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Secure, private, and transparent voting platform for administrators and voters.
        </p>
      </div>
    </div>
  );
};

export default Home;
