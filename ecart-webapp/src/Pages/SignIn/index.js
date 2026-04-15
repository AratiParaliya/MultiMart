import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import Logo from '../../assets/images/Logo.png';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";
import { GoogleLogin } from '@react-oauth/google';

const SignIn = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formFields, setFormfields] = useState({ email: '', password: '' });

  useEffect(() => { context.setisHeaderFooterShow(false); }, []);

  const onChangeInput = (e) => {
    setEmailNotVerified(false); // reset banner on any input change
    setFormfields({ ...formFields, [e.target.name]: e.target.value });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await postData("/api/user/google-signin", {
        token: credentialResponse.credential
      });
      if (res.error) {
        context.setAlertBox({ open: true, error: true, msg: res.msg });
      } else {
        context.setisLogin(true);
        const role = res.user?.role?.toLowerCase();
        if (role === "admin") {
          localStorage.clear();
          window.name = JSON.stringify({ token: res.token, user: res.user });
          window.location.href = "http://localhost:3001/admin/dashboard";
        } else {
          localStorage.setItem("token", res.token);
          localStorage.setItem("user", JSON.stringify(res.user));
          navigate("/");
        }
      }
    } catch (error) { console.log(error); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formFields.email) {
      context.setAlertBox({ open: true, error: true, msg: "Email cannot be blank!" });
      return;
    }
    if (!formFields.password) {
      context.setAlertBox({ open: true, error: true, msg: "Password cannot be blank!" });
      return;
    }

    setIsLoading(true);

    postData("/api/user/login", formFields).then((res) => {
      setIsLoading(false);

      if (res?.error) {
        // ✅ Email not verified — show inline banner
        if (res.msg === "Email not verified") {
          setEmailNotVerified(true);
          return;
        }
        context.setAlertBox({
          open: true, error: true,
          msg: res.msg || "Something went wrong!"
        });
        return;
      }

      if (!res.user) {
        context.setAlertBox({ open: true, error: true, msg: "User not found!" });
        return;
      }

      // ✅ SUCCESS
      context.setAlertBox({ open: true, error: false, msg: "Login successful!" });
      context.setisLogin(true);

      setTimeout(() => {
        const role = res.user?.role?.toLowerCase().trim();
        if (role === "admin") {
          const token = res.token;
          const user = encodeURIComponent(JSON.stringify({
            _id: res.user._id, name: res.user.name, role: res.user.role
          }));
          window.location.href = `http://localhost:3001/admin/dashboard?token=${token}&user=${user}`;
        } else {
          localStorage.setItem("token", res.token);
          localStorage.setItem("user", JSON.stringify(res.user));
          navigate("/");
        }
      }, 1000);

    }).catch(() => {
      setIsLoading(false);
      context.setAlertBox({ open: true, error: true, msg: "Server not responding. Try again!" });
    });
  };

  const handleResendVerification = () => {
    postData("/api/user/resend-verification", { email: formFields.email })
      .then((res) => {
        context.setAlertBox({
          open: true,
          error: !res.success,
          msg: res.success ? "Verification email resent! Check your inbox." : res.msg
        });
      });
  };

  return (
    <section className="signInPage section">
      <div className="shape-bottom">
        <svg fill="#fff" id="Layer_1" x="0px" y="0px" viewBox="0 0 1921 819.8"
          style={{ enableBackground: 'new 0 0 1921 819.8' }}>
          <path className="st0" d="M1921,413.1v406.7H0V0.5h0.41228,1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z" />
        </svg>
      </div>

      <div className="container">
        <div className="box card p-3 shadow border-0">
          <div className="text-center mb-2">
            <img src={Logo} alt="logo" style={{ width: "80px" }} />
          </div>

          <form className="mt-0" onSubmit={handleSubmit}>
            <h2 className="mb-4">Sign In</h2>

            <div className="form-group">
              <TextField label="Email" type="email" name="email"
                value={formFields.email} onChange={onChangeInput}
                variant="standard" className="w-100" />
            </div>

            <div className="form-group">
              <TextField label="Password" type="password" name="password"
                value={formFields.password} onChange={onChangeInput}
                variant="standard" className="w-100" />
            </div>

            <Link to="/forgot-password" className="border-effect txt">
              Forgot Password?
            </Link>

            {/* ✅ EMAIL NOT VERIFIED BANNER */}
            {emailNotVerified && (
              <div style={{
                background: "#FCEBEB",
                border: "1px solid #F09595",
                borderRadius: 10,
                padding: "14px 16px",
                marginTop: 16,
                marginBottom: 8,
                display: "flex",
                gap: 12,
                alignItems: "flex-start"
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="#A32D2D" strokeWidth="2"
                  style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#791F1F" }}>
                    Email not verified
                  </p>
                  <p style={{ margin: "4px 0 10px", fontSize: 12, color: "#A32D2D", lineHeight: 1.6 }}>
                    Check your inbox and click the verification link to activate your account.
                  </p>
                  <span
                    onClick={handleResendVerification}
                    style={{
                      fontSize: 12, color: "#2563eb",
                      cursor: "pointer", fontWeight: 600,
                      textDecoration: "underline"
                    }}
                  >
                    Resend verification email →
                  </span>
                </div>
              </div>
            )}

            <div className="d-flex align-items-center mt-3 mb-3">
              <Button type="submit" className="btn-blue col btn-lg btn-big"
                disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
              <Link to="/">
                <Button className="btn-lg col btn-big ml-3"
                  onClick={() => context.setisHeaderFooterShow(true)}
                  variant="outlined">
                  Cancel
                </Button>
              </Link>
            </div>

            <p className="txt">
              Not Registered?{" "}
              <Link to="/SignUp" className="border-effect">Sign Up</Link>
            </p>

            <h6 className="mt-3 text-center font-weight-bold">
              or continue with social account
            </h6>

            <div className="mt-3 text-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log("Login Failed")}
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignIn;