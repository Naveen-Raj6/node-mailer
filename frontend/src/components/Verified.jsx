import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Verified() {
  const location = useLocation();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get("success");
    setStatus(success === "true");
  }, [location]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md text-center w-96">
        {status === true && (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              ✅ Email Verified!
            </h2>
            <p className="text-gray-700">
              Your email has been successfully verified. You can now log in!
            </p>
          </>
        )}
        {status === false && (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              ❌ Verification Failed
            </h2>
            <p className="text-gray-700">
              The link may have expired or is invalid. Please try signing up again.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Verified;
