import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AutoService from "../services/auth_service";

const LoginComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [message, setMessage] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleLogin = async () => {
    try {
      let response = await AutoService.login(email, password); //送至後端
      // console.log(response);
      // localStorage.setItem是JS內建的方法
      // 把 JSON 字串存儲在名為 "user" 的本地儲存鍵中 ex.使用情境：保持登入狀態
      localStorage.setItem("user", JSON.stringify(response.data));
      window.alert("登入成功!您現在將重新導向到個人頁面。");
      // 登入成功 所以將全域在使用的CurrentUser用setCurrentUser更新
      // console.log(AuthService.getCurrentUser());
      setCurrentUser(AutoService.getCurrentUser());
      navigate("/profile");
    } catch (e) {
      // console.log(e.response.data);
      setMessage(e.response.data);
    }
  };

  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      <div>
        {message && <div className="alert alert-danger">{message}</div>}
        <div className="form-group">
          <label htmlFor="username">電子信箱：</label>
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
          />
        </div>
        <br />
        <div className="form-group">
          <button onClick={handleLogin} className="btn btn-primary btn-block">
            <span>登入系統</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
