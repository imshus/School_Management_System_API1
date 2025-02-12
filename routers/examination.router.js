const express = require("express");
const authMiddleware = require("../auth/auth");

const {
    newExamination,
    getAllExamination,
    getExaminationByClass,
    updateExaminationWithId,
    deleteexaminationwithId
} = require("../controller/examination.controller");

const router = express.Router();

router.post("/create", authMiddleware(["SCHOOL"]), newExamination);
router.get("/all", authMiddleware(["SCHOOL","TEACHER"]), getAllExamination);
router.get("/class/:id", authMiddleware(["SCHOOL","TEACHER","STUDENT"]), getExaminationByClass);
router.post("/update/:id", authMiddleware(["SCHOOL"]), updateExaminationWithId);
router.delete("/delete/:id", authMiddleware(["SCHOOL"]), deleteexaminationwithId);

module.exports = router;
