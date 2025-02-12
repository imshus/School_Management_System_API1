const express = require("express");
const authMiddleware = require("../auth/auth");
const {
    registerTeacher,
    loginTeacher,
    getTeacherWithQuery,
    getTeacherOwnData,
    updateTeacherWithId,
    deleteTeacherwithId,
    fetchTeacherWithId,

} = require("../controller/teacher.controller");

const router = express.Router();

router.post("/register",authMiddleware(["SCHOOL"]), registerTeacher);
router.get("/fetch-Query", authMiddleware(["SCHOOL"]), getTeacherWithQuery);
router.post("/login", loginTeacher);
router.patch("/update/:id", authMiddleware(["SCHOOL"]), updateTeacherWithId);
router.get("/fetch-single", authMiddleware(["TEACHER"]), getTeacherOwnData);
router.delete("/delete/:id", authMiddleware(["SCHOOL"]), deleteTeacherwithId);
router.get("/fetch/:id", authMiddleware(["SCHOOL","TEACHER"]), fetchTeacherWithId);

module.exports=router