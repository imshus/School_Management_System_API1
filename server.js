require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const schoolRouter = require("./routers/school.router");
const classRouter = require("./routers/class.router");
const subjectRouter = require("./routers/subject.router");
const studentRouter = require("./routers/student.router");
const teacherRouter = require("./routers/teacher.router");
const scheduleRouter = require("./routers/schedule.router");
const attendanceRouter=require("./routers/attendance.router");
const examinationRouter=require("./routers/examination.router")
const noticeRouter=require("./routers/notice.router")

const app = express();

const corsOption = { exposedHeaders: "Authentication" };
app.use(cors(corsOption));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/school", schoolRouter);
app.use("/api/class", classRouter);
app.use("/api/subject", subjectRouter);
app.use("/api/student", studentRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/schedule", scheduleRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/examination",examinationRouter);
app.use("/api/notice",noticeRouter);

//Mongodb Connection
const URL = process.env.URL1;
mongoose
  .connect(URL)
  .then(() => {
    console.log("Mongodb is Connected Successfully");
  })
  .catch((err) => {
    console.log(`Error ${err}`);
  });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is started at ${PORT}`);
});
