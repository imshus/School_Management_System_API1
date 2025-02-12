const express = require("express");
const authMiddleware = require("../auth/auth");
const {
  registerStudents,
  getStudentsWithQuery,
  loginStudents,
  updateStudentWithId,
  getStudentOwnData,
  deleteStudentwithId,
  fetchStudentsWithId,

} = require("../controller/student.controller");

const router = express.Router();

router.post("/register",authMiddleware(["SCHOOL"]), registerStudents);
router.get("/fetch-Query", authMiddleware(["SCHOOL",'TEACHER']), getStudentsWithQuery);
router.post("/login", loginStudents);
router.patch("/update/:id", authMiddleware(["SCHOOL"]), updateStudentWithId);
router.get("/fetch-single", authMiddleware(["STUDENT"]), getStudentOwnData);
router.delete("/delete/:id", authMiddleware(["SCHOOL"]), deleteStudentwithId);
router.get("/fetch", authMiddleware(["SCHOOL","STUDENT"]), fetchStudentsWithId);

module.exports = router;


