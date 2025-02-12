const express = require("express");
const authMiddleware = require("../auth/auth");

const {
  registerSchool,
  getAllSchool,
  loginSchool,
  updateSchool,
  getSchoolOwnData,
} = require("../controller/school.controller");

const router = express.Router();

router.post("/register", registerSchool);
router.get("/all", getAllSchool);
router.post("/login", loginSchool);
router.patch("/update", authMiddleware(["SCHOOL"]), updateSchool);
router.get("/fetch-single", authMiddleware(["SCHOOL"]), getSchoolOwnData);

module.exports = router;
