import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import Logo from '../../assets/images/Logo.png';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";
import { GoogleLogin } from '@react-oauth/google';

const SignUp = () => {
  const navigate = useNavigate();
  const context = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(false);
  const [verifyScreen, setVerifyScreen] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const [formFields, setFormfields] = useState({
    name: '', email: '', phone: '', password: '',
    confirmPassword: '', role: 'user',
    status: 'active', isVerified: false, loginType: 'manual'
  });

  useEffect(() => { context.setisHeaderFooterShow(false); }, []);

  const onChangeInput = (e) => {
    setFormfields({ ...formFields, [e.target.name]: e.target.value });
  };

  const handleSignUp = (e) => {
    e.preventDefault();

    if (!formFields.name) {
      context.setAlertBox({ open: true, error: true, msg: "Name cannot be blank!" });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formFields.email)) {
      context.setAlertBox({ open: true, error: true, msg: "Invalid email format!" });
      return;
    }
    if (formFields.phone.length !== 10) {
      context.setAlertBox({ open: true, error: true, msg: "Phone must be 10 digits!" });
      return;
    }
    if (formFields.password.length < 6) {
      context.setAlertBox({ open: true, error: true, msg: "Password must be at least 6 characters!" });
      return;
    }
    if (formFields.password !== formFields.confirmPassword) {
      context.setAlertBox({ open: true, error: true, msg: "Passwords do not match!" });
      return;
    }

    setIsLoading(true);

    postData("/api/user/signup", {
      name: formFields.name,
      email: formFields.email,
      phone: formFields.phone,
      password: formFields.password,
      role: formFields.role,
      status: formFields.status,
      isVerified: false,
      loginType: formFields.loginType
    }).then((res) => {
      setIsLoading(false);
      if (!res.error) {
        setRegisteredEmail(formFields.email);
        setVerifyScreen(true);
      } else {
        context.setAlertBox({ open: true, error: true, msg: res.msg });
      }
    }).catch(() => {
      setIsLoading(false);
      context.setAlertBox({ open: true, error: true, msg: "Server not responding. Try again!" });
    });
  };

  const handleResendEmail = () => {
    postData("/api/user/resend-verification", { email: registeredEmail }).then((res) => {
      context.setAlertBox({
        open: true,
        error: !res.success,
        msg: res.success ? "Verification email resent!" : res.msg
      });
    });
  };

 const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const res = await postData("/api/user/google-signup", {
      token: credentialResponse.credential
    });

    if (!res.error) {
      // ✅ login success
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      context.setisLogin(true);
      navigate("/");
    } else {
      // ❌ show error message from backend
      context.setAlertBox({
        open: true,
        error: true,
        msg: res.msg
      });
      setTimeout(() => {
  navigate("/SignIn");
}, 1500);
    }

  } catch (err) {
    console.log(err);
    context.setAlertBox({
      open: true,
      error: true,
      msg: "Google login failed!"
    });
  }
};

  // ✅ VERIFY EMAIL SCREEN
  if (verifyScreen) {
    return (
      <section className="signInPage section">
        <div className="container">
          <div className="box card p-4 shadow border-0 text-center"
            style={{ maxWidth: 440, margin: "0 auto" }}>

            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "#EAF3DE", display: "flex",
              alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px"
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="#27500A" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 7 10 7 10-7" />
              </svg>
            </div>

            <h4 style={{ fontWeight: 600, marginBottom: 8, color: "#0f1117" }}>
              Check your inbox
            </h4>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 8 }}>
              We sent a verification link to
            </p>
            <div style={{
              display: "inline-block",
              background: "#f1f5f9",
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              padding: "7px 16px",
              fontFamily: "monospace",
              fontSize: 13,
              color: "#334155",
              marginBottom: 16
            }}>
              {registeredEmail}
            </div>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>
              Click the link in the email to activate your account before signing in.
            </p>

            <Button
              variant="contained"
              fullWidth
              style={{
                background: "#0f1117", color: "#fff",
                marginBottom: 10, textTransform: "none",
                borderRadius: 8, padding: "10px 0", fontWeight: 600
              }}
              onClick={() => window.open("https://mail.google.com", "_blank")}
            >
              Open Gmail
            </Button>

            <Button
              variant="outlined"
              fullWidth
              style={{
                textTransform: "none", marginBottom: 16,
                borderRadius: 8, padding: "10px 0"
              }}
              onClick={() => navigate("/SignIn")}
            >
              Back to Sign In
            </Button>

            <hr style={{ borderColor: "#e2e8f0", margin: "8px 0 16px" }} />
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
              Didn't receive it?{" "}
              <span
                onClick={handleResendEmail}
                style={{ color: "#2563eb", cursor: "pointer", fontWeight: 600 }}
              >
                Resend email
              </span>
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ✅ NORMAL SIGNUP FORM
  return (
    <section className="signUpPage signInPage section">
      <div className="shape-bottom">
        <svg fill="#fff" id="Layer_1" x="0px" y="0px" viewBox="0 0 1921 819.8"
          style={{ enableBackground: 'new 0 0 1921 819.8' }}>
          <path className="st0" d="M1921,413.1v406.7H0V0.5h0.41228,1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z" />
        </svg>
      </div>

      <div className="container">
        <div className="box card p-3 shadow border-0">
          <div className="text-center mb-3">
            <img src={Logo} alt="logo" style={{ width: "80px" }} />
          </div>

          {/* ✅ onSubmit={handleSignUp} — THIS WAS THE BUG */}
          <form className="mt-3" onSubmit={handleSignUp}>
            <h2 className="mb-4">Sign Up</h2>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <TextField label='Name' type='text' name="name"
                    onChange={onChangeInput} variant='standard' className="w-100" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <TextField label='Contact No' type='text' name="phone"
                    onChange={onChangeInput} variant='standard' className="w-100" />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <TextField label='Email' type='email' name="email"
                    onChange={onChangeInput} variant='standard' className="w-100" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mt-3">
                  <select name="role" value={formFields.role}
                    onChange={onChangeInput} className="form-control">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <TextField label='Password' type="password" name="password"
                onChange={onChangeInput} variant='standard' className="w-100" />
            </div>

            <div className="form-group">
              <TextField label='Confirm Password' type="password" name="confirmPassword"
                onChange={onChangeInput} variant='standard' className="w-100" />
            </div>

            <div className="d-flex align-items-center mt-3 mb-3">
              <div className="row w-100">
                <div className="col-md-6">
                  <Button type="submit" className="btn-blue btn-lg btn-big w-100"
                    disabled={isLoading}>
                    {isLoading ? "Signing Up..." : "Sign Up"}
                  </Button>
                </div>
                <div className="col-md-6 pr-0">
                  <Link to="/" className="d-block w-100">
                    <Button className="btn-lg btn-big ml-3 w-100"
                      onClick={() => context.setisHeaderFooterShow(true)}
                      variant="outlined">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <p className="txt">
              Already registered?{" "}
              <Link to="/SignIn" className="border-effect">Sign In</Link>
            </p>

            <h6 className="mt-3 text-center font-weight-bold">
              or continue with social account
            </h6>

            <div className="mt-3 text-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log("Google signup error")}
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;