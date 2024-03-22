import { useState, useEffect } from "react";
import AutuService from "../services/auth_service";

const ProfileComponent = ({ currentUser, setCurrentUser }) => {
  let [role, setRole] = useState("student");
  let [message, setMessage] = useState("");

  const handleRole = (e) => {
    setRole(e.target.value);
  };

  const handleSet = (e) => {
    // console.log(`email為:${currentUser.user.email}  角色為:${role}`);
    AutuService.setRole(currentUser.user.email, role)
      .then(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        user.user.role = role;
        console.log(user);
        localStorage.setItem("user", JSON.stringify(user));
        window.alert("更改角色成功!");
        window.location.reload();
      })
      .catch((e) => {
        setMessage(e.response.data);
      });
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <h2>在獲取您的個人資料之前，您必須先登錄。</h2>
        </div>
      )}
      {currentUser && (
        <div>
          {currentUser.user.role ? (
            <div>
              <h2>以下是您的個人檔案：</h2>
              <table className="table">
                <tbody>
                  <tr>
                    <td>
                      <strong>姓名：{currentUser.user.username}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>您的用戶ID: {currentUser.user._id}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>
                        您註冊的電子信箱: {currentUser.user.email}
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>身份: {currentUser.user.role}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="row align-items-center">
              <div className="col-auto">
                <label className="fw-bold">請選擇您的角色：</label>
              </div>
              <div className="col-auto">
                <select
                  className="form-select"
                  style={{ width: "100px", margin: "2px" }}
                  value={role}
                  onChange={handleRole}
                >
                  <option value="student">學生</option>
                  <option value="instructor">講師</option>
                </select>
              </div>
              <div className="col-auto">
                <button onClick={handleSet} className="btn btn-primary">
                  <span>確定</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;

{
  /* <div>
            <h2>請選擇您的角色：</h2>
            <select>
              <option value="student">學生</option>
              <option value="instructor">講師</option>
            </select>
            <button>確定</button>
          </div> */
}
