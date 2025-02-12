const express = require("express");
const authMiddleware = require("../auth/auth");

const {
  createClass,
  getAllclasses,
  updateClasswithId,
  deleteClassWithId,
  getSingleclass,
  getAttendeeclass
} = require("../controller/class.controller");

const router = express.Router();

router.post("/create", authMiddleware(["SCHOOL"]), createClass);
router.get("/all", authMiddleware(["SCHOOL","TEACHER","STUDENT"]), getAllclasses);
router.get("/attendee",authMiddleware(["TEACHER"]),getAttendeeclass)
router.get("/single/:id", authMiddleware(["SCHOOL"]), getSingleclass);
router.patch("/update/:id", authMiddleware(["SCHOOL"]), updateClasswithId);
router.delete("/delete/:id", authMiddleware(["SCHOOL"]), deleteClassWithId);

module.exports = router;
