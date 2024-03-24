const Joi = require("joi");

// 驗證符合 schema 規定

const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(6).max(50).required().email(), // .email() ，檢查字串是否符合電子郵件的格式
    password: Joi.string().min(6).max(255).required(),
    role: Joi.string().required().valid("student", "instructor"),
  });

  // 將data進行驗證,符合 schema 的規定
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).max(255).required(),
  });

  return schema.validate(data);
};

const courseValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(6).max(50).required(),
    description: Joi.string().min(6).max(50).required(),
    price: Joi.number().min(10).max(9999).required(),
  });

  return schema.validate(data);
};
const googleCourseValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(6).max(50).required(),
    description: Joi.string().min(6).max(50).required(),
    price: Joi.number().min(10).max(9999).required(),
    googleToken: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.courseValidation = courseValidation;
module.exports.googleCourseValidation = googleCourseValidation;

// return schema.validate(data);
// 如果 data 符合 schema 規定，輸出會是：
// { error: null, value: { username: 'john_doe', email: 'john.doe@example.com', password: 'password123', role: 'student' } }

// 如果 data 不符合 schema 規定，輸出會是：
// { error: { /* 描述錯誤的詳細信息 */ }, value: null }
