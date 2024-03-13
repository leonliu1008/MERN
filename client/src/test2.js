// const axios = require("axios");
const API_URL = "http://localhost:8080/api/user";

async function example() {
  let data = await axios.get(API_URL + "/google", {});
  console.log(data);
}

example();
