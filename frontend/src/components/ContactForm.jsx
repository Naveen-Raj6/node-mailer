//5th mini project


import { useState } from "react"; 
// ✅ Importing React's useState hook to manage form data state

function ContactForm() {
  // ✅ State object to hold all form inputs
  // Instead of using separate useState for each field, we use one object
  const [formData, setFormData] = useState({
    name: "",     // Stores user's name
    email: "",    // Stores user's email
    subject: "",  // Stores subject of the message
    message: ""   // Stores actual message content
  });

  // ✅ Function to handle input changes
  // This keeps the form inputs in sync with React state
  const handleChange = (e) => {
    // Spread operator keeps previous values unchanged
    // [e.target.name] updates the correct field (name, email, subject, message)
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page refresh on form submit

    try {
      // ✅ Send form data to backend server
      const res = await fetch("http://localhost:5000/contact", {
        method: "POST", // We are sending data
        headers: { "Content-Type": "application/json" }, // Tell backend we're sending JSON
        body: JSON.stringify(formData) // Convert JS object to JSON string
      });

      // ✅ Convert backend response to JSON
      const data = await res.json();

      if (res.ok) {
        // ✅ If request is successful
        alert(data.message || "Message sent successfully ✅");

        // ✅ Reset the form fields after successful submission
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        // ❌ If backend returned an error
        alert(data.message || "Something went wrong ❌");
      }
    } catch (err) {
      // ❌ If fetch fails (server down, no internet, etc.)
      console.error(err);
      alert("Error sending email ❌");
    }
  };

  return (
    // ✅ Wrapper container for form and heading
    <div className="contact-container">
      {/* Heading & description above the form */}
      <h2>Contact Us</h2>
      <p>We’d love to hear from you! Fill out the form below.</p>

      {/* Form starts here */}
      <form onSubmit={handleSubmit} className="contact-form">
        {/* Name Input */}
        <input
          type="text"
          name="name"                     // Matches formData field
          placeholder="Your Name"          // Placeholder text
          value={formData.name}            // Controlled input (comes from state)
          onChange={handleChange}          // Updates state when typing
          required                         // HTML validation (cannot be empty)
        />

        {/* Email Input */}
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Subject Input */}
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />

        {/* Message Textarea */}
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
        />

        {/* Submit Button */}
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ContactForm; 
