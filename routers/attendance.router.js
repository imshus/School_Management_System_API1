const express = require("express");
const authMiddleware = require("../auth/auth");

const {
    markattendance, 
    getAttendence,
    checkAttendence
} = require("../controller/attendence.controller");

const router = express.Router();

router.post("/mark", authMiddleware(["TEACHER"]), markattendance);
router.get("/:studentId", authMiddleware(["SCHOOL","STUDENT"]), getAttendence);
router.get("/check/:classid", authMiddleware(["TEACHER"]), checkAttendence);

module.exports = router;