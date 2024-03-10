import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";

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

  const handleSearch = () => {
    // console.log(searchInput);

    CourseService.getCourseByName(searchInput) //將輸入的課程名稱傳到後端搜尋
      .then((courseName) => {
        // 若要用.map渲染到網頁,必須檢查來源是否為Array
        setSearchResult(courseName.data);
        // console.log(courseName.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleEnroll = (e) => {
    console.log(e.target);
    CourseService.enroll(e.target.id)
      .then(() => {
        window.alert("課程註冊成功!!重新導向課程頁面");
        navigate("/course");
      })
      .catch((e) => {
        console.log(e);
      });
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
          <button onClick={handleSearch} className="btn btn-primary">
            搜尋課程
          </button>
        </div>
      )}
      {currentUser && searchResult && searchResult.length != 0 && (
        <div>
          <p>這是我們從API返回的數據:</p>
          {searchResult.map((course) => {
            return (
              <div key={course._id} className="card" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h5 className="card-title">課程名稱:{course.title}</h5>
                  <p style={{ margin: "0.5rem 0rem" }} className="card-text">
                    {course.description}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    學生人數:{course.students.length}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    課程價格:{course.price}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    講師:{course.instructor.username}
                  </p>
                  <a
                    href="#"
                    id={course._id}
                    className="card-text btn btn-primary"
                    onClick={handleEnroll}
                  >
                    註冊課程
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EnrollComponent;

// Array[description
//   :
//   "讓你知道怎麼選好喝的飲料"
//   instructor
//   :
//   {_id: '65ec74fd6842d101221c0e1a', username: 'kem', email: 'kem5923638@yahoo.com.tw'}
//   price
//   :
//   1617
//   students
//   :
//   []
//   title
//   :
//   "2024買飲料活動"
//   __v
//   :
//   0
//   _id
//   :
//   "65ec75416842d101221c0e1e"]
