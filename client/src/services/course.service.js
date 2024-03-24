/**
 * MERN專案 會建立一些服務
 * 通常都會建立成叫:"service"
 * 此檔案就是建立service
 */

import axios from "axios";
const API_URL = "http://localhost:8080/api/courses";
// const API_URL = "https://mern-api-6703.onrender.com/api/courses";

class CourseService {
  // 製作PO文method
  post(title, description, price, googleToken) {
    let token; //要PO文之前需要先確定使用者有沒有token
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    // console.log("Authorization Token:", googleToken);
    //axios.post用法順序:URL+route+大括號內的value,可以1個以上的物件,傳遞完成會回傳一個promise,所以要return接
    return axios.post(
      API_URL,
      { title, description, price, googleToken },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  } //用於處理與後端 API 的通信,可以傳到後端的此route

  // 使用insreuctor id,找到講師擁有的課程
  get(_id) {
    let token; //要得到課程之前,需要token
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    // 把get的資訊帶到後端, 後端會看請求 前往route.get("/API_URL + "/indtructor/" + _id")
    return axios.get(API_URL + "/instructor/" + _id, {
      headers: {
        // 設定"Authorization"標頭，並將其值設為使用者的驗證令牌(token)
        Authorization: token,
      },
    });
  }

  // 使用student id,找到學生擁有的課程
  getEnrolledCourses(_id) {
    let token; //要得到課程之前,需要token
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "/student/" + _id, {
      headers: {
        Authorization: token,
      },
    });
  }

  getCourseByName(courseName) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(API_URL + "/findByName/" + courseName, {
      headers: {
        Authorization: token,
      },
    });
  }

  enroll(_id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.post(
      API_URL + "/enroll/" + _id,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }
}

export default new CourseService();

// // 製作PO文method
// post(title, description, price, googleToken) {
//   let token; //要PO文之前需要先確定使用者有沒有token
//   if (localStorage.getItem("user")) {
//     token = JSON.parse(localStorage.getItem("user")).token;
//   } else {
//     token = "";
//   }
//   //axios.post用法順序:URL+route+大括號內的value,可以1個以上的物件,傳遞完成會回傳一個promise,所以要return接
//   return axios.post(
//     API_URL,
//     { title, description, price },
//     {
//       headers: {
//         Authorization: token,
//       },
//     }
//   );
// } //用於處理與後端 API 的通信,可以傳到後端的此route
