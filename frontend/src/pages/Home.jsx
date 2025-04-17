import Navbar from "../components/Navbar";
import background from "../assets/home.jpg"; // make sure this path is correct for your setup

const Home = () => {
  console.log("🏠 Home Page Rendering");

  return (
    <div
      className="min-h-screen min-w-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `url(${background})` }}
    >
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center max-w-2xl w-full">
          <h1 className="text-5xl font-extrabold mb-6 text-white drop-shadow-md">
            Welcome to the Online Voting System
          </h1>
          <p className="text-white/80 text-lg mb-8">
            Secure, private, and transparent voting platform for administrators and voters.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-white/30 text-blue font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:bg-white/60 hover:text-gray-900 hover:rounded-full">
              Get Started
            </button>
            <button className="border border-white/50 text-blue px-6 py-3 rounded-lg transition-all duration-300 hover:bg-white hover:text-gray-900 hover:rounded-full">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
