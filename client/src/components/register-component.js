import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 重新導向的功能
import AutuService from "../services/auth_service";
import { useGoogleLogin } from "@react-oauth/google";

const RegisterComponent = () => {
  const navigate = useNavigate(); // 重新導向的功能
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [role, setRole] = useState("");
  let [message, setMessage] = useState("");

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleRole = (e) => {
    setRole(e.target.value);
  };

  const handleRegister = () => {
    //執行服務裡面的class裡面的method(將input內容傳至後端)
    AutuService.regiser(username, email, password, role)
      .then(() => {
        window.alert("註冊成功。您現在將被導向到登入頁面");
        navigate("/login");
      })
      .catch((e) => {
        setMessage(e.response.data);
      });
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
  });

  const buttonStyle = {
    margin: "0rem 1rem",
    padding: "0.2rem 0.5rem",
    backgroundColor: "rgb(7, 7, 7)",
    color: "rgb(255, 255, 255)",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    alignItems: "center",
    textDecoration: "none",
  };

  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      <div>
        {message && <div className="alert alert-danger">{message}</div>}
        <div>
          <label htmlFor="username">用戶名稱:</label>
          <input
            onChange={handleUsername}
            type="text"
            className="form-control"
            name="username"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="email">電子信箱：</label>
          <input
            onChange={handleEmail}
            type="text"
            className="form-control"
            name="email"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">密碼：</label>
          <input
            onChange={handlePassword}
            type="password"
            className="form-control"
            name="password"
            placeholder="長度至少超過6個英文或數字"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">身份：</label>
          <input
            onChange={handleRole}
            type="text"
            className="form-control"
            placeholder="只能填入student或是instructor這兩個選項其一"
            name="role"
          />
        </div>
        <br />
        <button onClick={handleRegister} className="btn btn-primary">
          <span>註冊會員</span>
        </button>
        <button
          onClick={login}
          className="btn btn-lg btn-google"
          style={buttonStyle}
        >
          <img
            src="https://img.icons8.com/color/16/000000/google-logo.png"
            alt="Google Logo"
            style={{ marginRight: "0.5rem" }}
          />
          透過Google登入
        </button>
      </div>
    </div>
  );
};

export default RegisterComponent;
