import { useState, useContext, useEffect } from "react";
import { MyContext } from "../../App";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { MdEmail, MdLockReset, MdCheck } from "react-icons/md";

const ForgotPassword = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    context.setisHeaderFooterShow(false);
  }, []);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async () => {
    let newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setErrors({}); setLoading(true);
    try {
      const res = await postData("/api/user/send-otp", { email });
      if (res?.success) {
        setStep(2); setTimer(60);
        context.setAlertBox({ open: true, error: false, msg: "OTP sent to your email" });
      } else {
        context.setAlertBox({ open: true, error: true, msg: res?.msg || "Failed to send OTP" });
      }
    } catch {
      context.setAlertBox({ open: true, error: true, msg: "Server error" });
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    let newErrors = {};
    if (!otp) newErrors.otp = "OTP is required";
    else if (otp.length !== 6) newErrors.otp = "OTP must be 6 digits";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setErrors({}); setLoading(true);
    try {
      const res = await postData("/api/user/verify-otp", { email, otp: Number(otp) });
      if (res?.success) {
        setStep(3);
      } else {
        context.setAlertBox({ open: true, error: true, msg: res?.msg || "Invalid OTP" });
      }
    } catch {
      context.setAlertBox({ open: true, error: true, msg: "Server error" });
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    let newErrors = {};
    if (!newPassword) newErrors.password = "Password is required";
    else if (newPassword.length < 6) newErrors.password = "Minimum 6 characters required";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setErrors({}); setLoading(true);
    try {
      const res = await postData("/api/user/reset-password", { email, otp: Number(otp), newPassword });
      if (res?.success) {
        context.setAlertBox({ open: true, error: false, msg: "Password updated successfully!" });
        navigate("/signIn");
      } else {
        context.setAlertBox({ open: true, error: true, msg: res?.msg || "Reset failed" });
      }
    } catch {
      context.setAlertBox({ open: true, error: true, msg: "Server error" });
    }
    setLoading(false);
  };

  const steps = [
    { label: "Email", icon: <MdEmail size={13} /> },
    { label: "Verify", icon: <MdCheck size={13} /> },
    { label: "Reset", icon: <MdLockReset size={13} /> }
  ];

  return (
    <section className="forgetPassPage section" style={{ minHeight: "100vh" }}>
      <div className="container">
        <div className="box card" style={{ maxWidth: "420px" }}>

          {/* Step Indicator */}
          <div className="stepIndicator">
            {steps.map((s, i) => (
              <>
                <div key={i} className={`step ${step > i + 1 ? "done" : step === i + 1 ? "active" : ""}`}>
                  <div className="step-dot">
                    {step > i + 1 ? <MdCheck size={12} /> : i + 1}
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className={`step-line ${step > i + 1 ? "active" : ""}`} key={`line-${i}`} />
                )}
              </>
            ))}
          </div>

          {/* STEP 1 — Email */}
          {step === 1 && (
            <div className="fadeInUp">
              <div style={{
                width: "52px", height: "52px", background: "var(--surface)",
                borderRadius: "50%", display: "flex", alignItems: "center",
                justifyContent: "center", marginBottom: "16px",
                border: "1px solid var(--border)"
              }}>
                <MdEmail size={22} color="var(--primary)" />
              </div>
              <h4>Forgot Password?</h4>
              <p className="text-muted" style={{ marginBottom: "24px" }}>
                Enter your email address and we'll send you a verification code.
              </p>
              <TextField
                label="Email Address"
                variant="standard"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                style={{ marginBottom: "24px" }}
              />
              <Button
                className="btn-blue btn-big w-100"
                onClick={handleSendOtp}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </Button>
            </div>
          )}

          {/* STEP 2 — OTP */}
          {step === 2 && (
            <div className="fadeInUp">
              <div style={{
                width: "52px", height: "52px", background: "var(--info-bg)",
                borderRadius: "50%", display: "flex", alignItems: "center",
                justifyContent: "center", marginBottom: "16px",
                border: "1px solid rgba(26,74,140,0.15)"
              }}>
                <MdEmail size={22} color="var(--info)" />
              </div>
              <h4>Check your email</h4>
              <p className="text-muted" style={{ marginBottom: "8px" }}>
                We sent a 6-digit code to <strong style={{ color: "var(--text-primary)" }}>{email}</strong>
              </p>

              <TextField
                label="6-Digit Code"
                variant="standard"
                fullWidth
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                error={!!errors.otp}
                helperText={errors.otp}
                inputProps={{ maxLength: 6, style: { letterSpacing: "8px", fontSize: "20px", fontFamily: "var(--font-heading)", fontWeight: 600 } }}
                style={{ marginBottom: "24px", marginTop: "16px" }}
              />

              <Button
                className="btn-blue btn-big w-100"
                onClick={handleVerifyOtp}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </Button>

              <div style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: "var(--text-muted)" }}>
                {timer > 0 ? (
                  <span>Resend code in <strong style={{ color: "var(--primary)" }}>{timer}s</strong></span>
                ) : (
                  <Button
                    onClick={handleSendOtp}
                    style={{
                      color: "var(--primary)", fontSize: "13px",
                      textTransform: "none", fontFamily: "var(--font-body)",
                      padding: "4px 8px", minWidth: "auto"
                    }}
                  >
                    Resend Code
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3 — New Password */}
          {step === 3 && (
            <div className="fadeInUp">
              <div style={{
                width: "52px", height: "52px", background: "var(--success-bg)",
                borderRadius: "50%", display: "flex", alignItems: "center",
                justifyContent: "center", marginBottom: "16px",
                border: "1px solid var(--success-border)"
              }}>
                <MdLockReset size={22} color="var(--success)" />
              </div>
              <h4>Set New Password</h4>
              <p className="text-muted" style={{ marginBottom: "24px" }}>
                Choose a strong password — at least 6 characters.
              </p>
              <TextField
                label="New Password"
                type="password"
                variant="standard"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                style={{ marginBottom: "24px" }}
              />
              <Button
                className="btn-blue btn-big w-100"
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;