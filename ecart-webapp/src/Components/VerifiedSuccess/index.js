import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
import { jwtDecode } from "jwt-decode";


const VerifyStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [status, setStatus] = useState("loading"); 
  // loading | success | error


useEffect(() => {
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  if (token) {
    localStorage.setItem("token", token);

    // ✅ Decode token to get userId
    const decoded = jwtDecode(token);
    const userId = decoded.userId;

    fetchDataFromApi(`/api/user/${userId}`)
      .then((res) => {
        if (res?.success) {
          localStorage.setItem("user", JSON.stringify(res.user));
          setStatus("success");

          setTimeout(() => {
            window.location.href = "/"; 
          }, 2000);
        } else {
          setStatus("error");
        }
      })
      .catch(() => {
        setStatus("error");
      });

  } else {
    setStatus("error");
  }
}, [location]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="text-center">

        {/* 🔄 LOADING */}
        {status === "loading" && (
          <>
            <h2>Verifying...</h2>
            <div className="spinner-border mt-3"></div>
          </>
        )}

        {/* ✅ SUCCESS */}
        {status === "success" && (
          <>
            <h1 className="text-success">✅ Email Verified Successfully</h1>
            <p>Logging you in...</p>

            <div className="mt-4">
              <div className="spinner-border text-success"></div>
            </div>
          </>
        )}

        {/* ❌ ERROR */}
        {status === "error" && (
          <>
            <h1 className="text-danger">❌ Verification Failed</h1>
            <p>Invalid or expired link</p>

            <button
              className="btn btn-dark mt-3"
              onClick={() => navigate("/SignIn")}
            >
              Go to Login
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default VerifyStatus;