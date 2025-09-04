import { useState } from "react";

function Signup() {
  // useState hook → keeps track of input values (name & email)
  const [form, setForm] = useState({ name: "", email: "" });

  // useState hook → keeps track of status messages (loading, success, error)
  const [message, setMessage] = useState("");

  // Handles input changes (for both name and email)
  const handleChange = (e) => {
    // e.target.name → field name ("name" or "email")
    // e.target.value → new value typed by user
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page reload
    setMessage("Sending..."); // Show loading message

    try {
      // Send POST request to backend API
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Tell backend we’re sending JSON
        body: JSON.stringify(form), // Convert form data into JSON
      });

      const data = await res.json(); // Convert response into JS object
      if (data.success) {
        // If backend says success
        setMessage("✅ Verification email sent! Check your inbox.");
        setForm({ name: "", email: "" }); // Reset form after success
      } else {
        // If backend returns error
        setMessage("❌ Failed: " + data.error);
      }
    } catch (err) {
      // If request fails (e.g., server down, network issue)
      console.error(err);
      setMessage("❌ Something went wrong");
    }
  };

  return (
    // Wrapper div for centering the form on screen
    <div
      style={{
        display: "flex", // Use flexbox
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        height: "100vh", // Full viewport height
        backgroundColor: "#f3f4f6", // Light gray background
      }}
    >
      {/* Signup form */}
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#fff", // White card
          padding: "24px", // Space inside card
          borderRadius: "12px", // Rounded corners
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)", // Soft shadow
          width: "380px", // Fixed width
        }}
      >
        {/* Form title */}
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "16px",
            textAlign: "center",
            color: "#111",
          }}
        >
          Signup
        </h2>

        {/* Name input field */}
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={form.name}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        />

        {/* Email input field */}
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        />

        {/* Signup button */}
        <button
          type="submit"
          style={{
            width: "100%",
            backgroundColor: "#3b82f6", // Blue
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
          }}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = "#2563eb") // Darker blue on hover
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = "#3b82f6") // Reset to normal blue
          }
        >
          Signup
        </button>

        {/* Status message (only shows if not empty) */}
        {message && (
          <p
            style={{
              marginTop: "12px",
              textAlign: "center",
              fontSize: "14px",
              color: "#555",
            }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default Signup;
