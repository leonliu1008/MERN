/**
 * MERN專案 會建立一些服務
 * 通常都會建立成叫:"service"
 * 此檔案就是建立service
 */

import axios from "axios";
const API_URL = "http://localhost:8080/api/user";
// const API_URL = "https://mern-api-6703.onrender.com/api/user";
class AuthService {
  // 將網頁內容透過useState 傳到此method
  // 將email, password送至後端驗證
  login(email, password) {
    return axios.post(API_URL + "/login", {
      email,
      password,
    });
  }

  logout() {
    // JS內建功能(當作登出功能)
    localStorage.removeItem("user");
  }

  googleLogin(userInfo) {
    return axios.post(API_URL + "/google", { userInfo });
  }

  regiser(username, email, password, role) {
    //axios.post用法順序:URL+route+大括號內的value,傳遞完成會回傳一個promise,所以要return接
    return axios.post(API_URL + "/register", {
      username,
      email,
      password,
      role,
    }); //用於處理與後端 API 的通信,可以傳到後端的此route,然後進行後端route.post
  }

  getCurrentUser() {
    // 取得localStorage user資料 轉成JSON傳回(當登入狀態)
    return JSON.parse(localStorage.getItem("user"));
  }

  setRole(email, role) {
    return axios.post(API_URL + "/profile", {
      email,
      role,
    });
  }
}

export default new AuthService();
