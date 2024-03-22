const router = require("express").Router();
const Course = require("../models").course;
const courseValidation = require("../validation").courseValidation;
const googleCourseValidation = require("../validation").googleCourseValidation;

router.use((req, res, next) => {
  console.log("coures route 正在接受一個requesst...");
  // console.log(req.body);
  next();
});

/**
 *  .populate
 *  可以透過instructor來做關聯,查詢到使用者(因為instructor已經設定與使用者ID相同)
 */
// 獲得系統中的所有課程
router.get("/", async (req, res) => {
  try {
    let courseFound = await Course.find({})
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用講師id尋找課程
router.get("/instructor/:_instructor_id", async (req, res) => {
  let { _instructor_id } = req.params;
  let coursesFound = await Course.find({ instructor: _instructor_id })
    .populate("instructor", ["username", "email"])
    .exec();
  return res.send(coursesFound);
});

// 用學生id尋找註冊的課程
router.get("/student/:_student_id", async (req, res) => {
  let { _student_id } = req.params;
  try {
    let coursesFound = await Course.find({ students: _student_id })
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(coursesFound);
  } catch (e) {
    return res.send(e);
  }
});

// 用課程id尋找課程
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let couresFound = await Course.findOne({ _id })
      .populate("instructor", ["email"])
      .exec();
    return res.send(couresFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用課程名稱尋找課程
router.get("/findByName/:courseName", async (req, res) => {
  let { courseName } = req.params;
  try {
    // Course.find 因為傳回去才會是陣列,react裡面的.map的功能必須是陣列
    let couresFound = await Course.find({ title: courseName }) //資料庫的課程名稱=title,用收進來的name對應title
      .populate("instructor", ["email", "username"])
      .exec();
    return res.send(couresFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 新增課程
router.post("/", async (req, res) => {
  // 創見新課程之前,驗證數據符合規範
  // console.log(req.body);
  let validation;
  if (req.body.googleToken) {
    validation = googleCourseValidation;
  } else {
    validation = courseValidation;
  }
  let { error } = validation(req.body);
  if (error) {
    console.log("validation 驗證失敗");
    return res.status(400).send(error.details[0].message);
  } else {
    console.log("validation 驗證成功");
  }

  if (req.user.isStudent()) {
    return res
      .status(400)
      .send("只有講師才能發布新課程。若已是講師，請透過講師帳號登入。");
  }

  let { title, description, price, googleToken } = req.body;
  let instructorModel;
  if (googleToken) {
    instructorModel = "GoogleUser"; // 如果 googleToken 不存在，表示使用者是一般註冊的
  } else {
    instructorModel = "User"; // 如果 googleToken 存在，表示使用者是透過 Google 登入的
  }
  console.log(instructorModel);
  // 創見課程(關鍵是填入req.user._id);
  try {
    let newCourse = new Course({
      title,
      description,
      price,
      //創見課程的人,instructor 會填入req.user._id(一定要等於req.user._id)
      instructor: req.user._id, //已通過中間件驗證,所以可以得到req.user._id(instructor的type建立的時候是_id)
      instructorModel,
    });
    // let savedCourse = await newCourse.save();
    await newCourse.save();
    return res.send("新課程已經保存");
  } catch (e) {
    return res.status(500).send("無法創見課程。。。");
  }
});

// 更改課程
router.patch("/:_id", async (req, res) => {
  // 更改課程之前,驗證數據符合規範
  let { error } = courseValidation(req.body);
  if (error) {
    console.log("courseValidation 驗證失敗");
    return res.status(400).send(error.details[0].message);
  } else {
    console.log("courseValidation 驗證成功");
  }

  let { _id } = req.params;
  // console.log(_id);
  // 確認課程存在;
  try {
    let courseFound = await Course.findOne({ _id });
    if (!courseFound) {
      return res.status(400).send("找不到課程，無法更新");
    }

    //使用者必須是此課程講師，才能編輯課程
    if (courseFound.instructor.equals(req.user._id)) {
      // req.body從前端過來要更新的內容
      let updatedCourse = await Course.findOneAndUpdate({ _id }, req.body, {
        new: true, // 更新後返回新的文檔
        runValidators: true, //更新文檔之前先檢查形式對不對
      });
      return res.send({
        message: "課程已經被更新成功",
        updatedCourse,
      });
    } else {
      return res.status(403).send("只有此課程的講師才能編輯課程。");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 註冊課程(學生透過id註冊新課程)
router.post("/enroll/:_id", async (req, res) => {
  // console.log("進入enroll");
  let { _id } = req.params;
  try {
    let course = await Course.findOne({ _id }).exec();
    course.students.push(req.user._id); // 因中間件使用者會帶著token來,代表使用者有帶著資訊,所以用push將資料放回使用者
    await course.save();
    return res.send("註冊完成");
  } catch (e) {
    return res.send(e);
  }
});

router.delete("/:_id", async (req, res) => {
  // 更改課程之前,驗證數據符合規範
  let { error } = courseValidation(req.body);
  if (error) {
    console.log("courseValidation 驗證失敗");
    return res.status(400).send(error.details[0].message);
  } else {
    console.log("courseValidation 驗證成功");
  }
  let { _id } = req.params;
  // console.log(_id);
  // 確認課程存在;
  try {
    let courseFound = await Course.findOne({ _id });
    if (!courseFound) {
      return res.status(400).send("找不到課程，無法刪除");
    }

    //使用者必須是此課程講師，才能刪除課程
    if (courseFound.instructor.equals(req.user._id)) {
      // req.body從前端過來要更新的內容
      await Course.deleteOne({ _id }).exec();
      return res.send("成功刪除課程");
    } else {
      return res.status(403).send("只有此課程的講師才能刪除課程。");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
