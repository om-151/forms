import { useState } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL);

export default function Form() {
    const [formData, setFormData] = useState({ name: "", title: "", message: "" });
    const [status, setStatus] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit("formData", formData);

        setFormData({ name: "", title: "", message: "" });
    };

    socket.on("success", (data) => setStatus(data.message));
    socket.on("error", (data) => setStatus(data.message));

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
            <form onSubmit={handleSubmit} className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Form</h2>

                <label className="block mb-2 text-gray-300">Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name} // Bind input to state
                    className="w-full border border-gray-600 bg-gray-700 p-3 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-300 transition duration-300"
                    onChange={handleChange}
                    required
                />

                <label className="block mt-4 mb-2 text-gray-300">Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title} // Bind input to state
                    className="w-full border border-gray-600 bg-gray-700 p-3 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-300 transition duration-300"
                    onChange={handleChange}
                    required
                />

                <label className="block mt-4 mb-2 text-gray-300">Message</label>
                <textarea
                    name="message"
                    value={formData.message} // Bind input to state
                    className="w-full border border-gray-600 bg-gray-700 p-3 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-300 transition duration-300"
                    onChange={handleChange}
                    required
                />

                <button
                    type="submit"
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg w-full transition duration-300"
                >
                    Submit
                </button>

                {status && <p className="mt-4 text-green-400 text-center">{status}</p>}
            </form>
        </div>
    );
}
