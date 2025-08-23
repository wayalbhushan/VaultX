export default function Signup() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <form className="bg-gray-800 p-8 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 mb-4 rounded bg-gray-700 focus:outline-none"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-gray-700 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-gray-700 focus:outline-none"
        />
        <button className="w-full bg-cyan-500 hover:bg-cyan-600 p-3 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
}
