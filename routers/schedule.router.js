const express = require("express");
const authMiddleware = require("../auth/auth");
const {
    getAllScheduleWithClass,
    createSchedule,
    updateSchedulewithId,
    deleteScheduleWithId,
    getAllScheduleWithId,
} = require("../controller/schedule.controller");

const router = express.Router();

router.post("/create", authMiddleware(["SCHOOL"]), createSchedule);
router.get("/fetch-with-class/:id", authMiddleware(["SCHOOL","TEACHER","STUDENT"]), getAllScheduleWithClass);
router.get("/fetch/:id", authMiddleware(["SCHOOL"]), getAllScheduleWithId);
router.patch("/update/:id", authMiddleware(["SCHOOL"]), updateSchedulewithId);
router.delete("/delete/:id", authMiddleware(["SCHOOL"]), deleteScheduleWithId);

module.exports = router;