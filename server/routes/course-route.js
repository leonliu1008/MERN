const router = require("express").Router();
const Course = require("../models").course;
const courseValidation = require("../validation").courseValidation;

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

// 新增課程
router.post("/", async (req, res) => {
  // 創見新課程之前,驗證數據符合規範
  let { error } = courseValidation(req.body);
  if (error) {
    console.log("courseValidation 驗證失敗");
    return res.status(400).send(error.details[0].message);
  } else {
    console.log("courseValidation 驗證成功");
  }

  if (req.user.isStudent()) {
    return res
      .status(400)
      .send("只有講師才能發布新課程。若已是講師，請透過講師帳號登入。");
  }

  let { title, description, price } = req.body;
  // 創見課程(關鍵是填入req.user._id)
  try {
    let newCourse = new Course({
      title,
      description,
      price,
      //創見課程的人,instructor 會填入req.user._id(一定要等於req.user._id)
      instructor: req.user._id, //已通過中間件驗證,所以可以得到req.user._id(instructor的type建立的時候是_id)
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