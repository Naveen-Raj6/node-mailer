// 6th Mini Project - Signup Form with Inline CSS
// ----------------------------------------------------
// This React component creates a simple signup form
// with inline styles, handles user input, and submits
// data to a backend API (http://localhost:5000/signup).
// ----------------------------------------------------

import { useState } from "react";

function SignupForm() {
  // ✅ useState hook to store form data (name + email)
  const [formData, setFormData] = useState({ name: "", email: "" });

  // ✅ Function to handle input changes (name/email fields)
  // e.target.name --> the field's "name" attribute (name/email)
  // e.target.value --> the user's input value
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page reload (default HTML form behavior)
    try {
      // Sending POST request to backend API
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST", // HTTP method
        headers: { "Content-Type": "application/json" }, // JSON request
        body: JSON.stringify(formData), // Convert JS object -> JSON
      });

      // Convert backend response into JSON
      const data = await res.json();

      if (res.ok) {
        // ✅ Success case (status 200–299)
        alert(data.message || "Message sent successfully ✅");

        // Reset the form fields to empty after successful submission
        setFormData({ name: "", email: "" });
      } else {
        // ❌ Error case (status 400/500)
        alert(data.message || "Something went wrong ❌");
      }
    } catch (err) {
      // If network/server error occurs
      console.error(err);
      alert("Signup failed");
    }
  };

  // ✅ JSX to render the form
  return (
    <form
      onSubmit={handleSubmit} // Handle form submission
      style={{
        // Inline CSS styling for the <form>
        maxWidth: "400px", // Form width
        margin: "50px auto", // Centered on page
        padding: "20px", // Inner spacing
        border: "1px solid #ddd", // Light border
        borderRadius: "10px", // Rounded corners
        backgroundColor: "#f9f9f9", // Light gray background
        display: "flex", // Flexbox layout
        flexDirection: "column", // Stack inputs vertically
        gap: "15px", // Space between fields
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)", // Subtle shadow effect
      }}
    >
      {/* Name input field */}
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={formData.name} // Controlled input value
        onChange={handleChange} // Update state on typing
        required // Field must be filled
        style={{
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          fontSize: "16px",
        }}
      />

      {/* Email input field */}
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={formData.email} // Controlled input value
        onChange={handleChange} // Update state on typing
        required // Field must be filled
        style={{
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          fontSize: "16px",
        }}
      />

      {/* Submit button */}
      <button
        type="submit"
        style={{
          padding: "12px",
          backgroundColor: "#4CAF50", // Green color
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontSize: "16px",
          cursor: "pointer", // Show pointer cursor
          transition: "background 0.3s", // Smooth hover transition
        }}
        // Inline hover effect (changes button color on hover)
        onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
      >
        Sign Up
      </button>
    </form>
  );
}

export default SignupForm;
