const express = require("express");
const authMiddleware = require("../auth/auth");

const {
    createNotice,
    updateNoticewithId,
    deleteNoticeWithId,
    getAllNotices,
    getAllNoticesForTeacher,
    getAllNoticesForStudent
} = require("../controller/notice.controller");

const router = express.Router();

router.post("/create", authMiddleware(["SCHOOL"]), createNotice);
router.get("/all", authMiddleware(["SCHOOL"]), getAllNotices);
router.get("/teacher", authMiddleware(["TEACHER"]), getAllNoticesForTeacher);
router.get("/student", authMiddleware(["STUDENT"]), getAllNoticesForStudent);
router.patch("/update/:id", authMiddleware(["SCHOOL"]), updateNoticewithId);
router.delete("/delete/:id", authMiddleware(["SCHOOL"]), deleteNoticeWithId);

module.exports = router;