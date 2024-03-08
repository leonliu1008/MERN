import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EnrollComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  let [searchInput, setSearchInput] = useState("");
  let [searchResult, setSearchResult] = useState(null); // 接收搜尋到的結果
  const handleTakeToLogin = () => {
    navigate("/login");
  };

  const handleChargeInput = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>您必須先登入才能註冊課程</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            回到登入頁面
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role === "instructor" && (
        <div>
          <h1>只有學生才可以註冊課程</h1>
        </div>
      )}
      {currentUser && currentUser.user.role === "student" && (
        <div className="search input-group mb-3">
          <input
            type="text"
            className="form-control"
            onChange={handleChargeInput}
          />
          <button className="btn btn-primary">搜尋課程</button>
        </div>
      )}
    </div>
  );
};

export default EnrollComponent;
