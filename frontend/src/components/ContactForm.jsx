import { useState } from "react";
import axios from "axios";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await axios.post("http://localhost:5000/contact", formData);
      if (res.data.success) {
        setStatus("✅ Message sent successfully!");
        setFormData({ name: "", email: "", message: "" }); // reset form
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ Failed to send message. Try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>📩 Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ display: "block", margin: "10px 0", width: "100%" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ display: "block", margin: "10px 0", width: "100%" }}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
          style={{ display: "block", margin: "10px 0", width: "100%" }}
        />
        <button type="submit">Send</button>
      </form>
      <p>{status}</p>
    </div>
  );
}
