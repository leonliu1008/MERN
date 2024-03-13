const jwtDecode = require("jwt-decode");

const token =
  "ya29.a0Ad52N38gfowwNiclATn1TeFkUffJJyh97Ctb6RJGsUH7tNp6LNANo7UOsw_uNJUrnDuTAvJzvfvc8IoTZRpbvFFN1w6FA5N34fHdwBSZ-lYUh1AH0ro-5tyAtXEC0WQsM4JdiJgN8cUJ5oVi2yrE4KWZpfg4ems1NwaCgYKAZ8SARMSFQHGX2MipuaTryQn_IkvmWq7gJJz3Q0169";

const decoded = jwtDecode(token);
console.log(decoded);
