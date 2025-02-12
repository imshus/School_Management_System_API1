const express = require("express");
const authMiddleware = require("../auth/auth");
const {
  createSubject,
  getAllsubject,
  updateSubjectwithId,
  deleteSubjectWithId,
} = require("../controller/subject.controller");

const router = express.Router();

router.post("/create", authMiddleware(["SCHOOL"]), createSubject);
router.get("/all", authMiddleware(["SCHOOL"]), getAllsubject);
router.patch("/update/:id", authMiddleware(["SCHOOL"]), updateSubjectwithId);
router.delete("/delete/:id", authMiddleware(["SCHOOL"]), deleteSubjectWithId);

module.exports = router;
