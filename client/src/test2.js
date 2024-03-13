// 提供 Google API 的端點
const apiEndpoint = "https://www.googleapis.com/oauth2/v1/userinfo";

// 提供 access_token
const accessToken =
  "ya29.a0Ad52N3-W3bAcHpuJrgzEhLH4gKNmScA7Hzhax8sBlp9EL16aYef2UL0yXcu9Azt2KGGA7BrOntN9lGOryMsRziNMf4pqDvPob5HcLw1NUUe1QcLoBnzqApkalB8RhNwB44vs-Jw-Kh4f-mOrxFViY2hm_NDb2qbyOQaCgYKAfESARMSFQHGX2Mi2LYoosnlwfK4RrQNECUFIg0169";

// 組合請求的 URL
const url = `${apiEndpoint}?access_token=${accessToken}`;

// 使用 fetch 發送 GET 請求
fetch(url)
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`請求失敗，狀態碼: ${response.status}`);
    }
  })
  .then((userInfo) => {
    // 使用者資訊
    console.log("使用者資訊:", userInfo);
  })
  .catch((error) => {
    console.error("錯誤:", error);
  });
