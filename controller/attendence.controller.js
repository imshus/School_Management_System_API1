const Attendence = require("../models/attendance.model");
const moment = require("moment");

const markattendance = async (req, res) => {
  try {
    const {studentId, date, status,classId} = req.body;
    const schoolId = req.user.schoolId;

    const newAttendence = new Attendence({
      student: studentId,
      date,
      status,
      class: classId,
      school: schoolId,
    });
    
    await newAttendence.save();
    res
      .status(201)
      .json({ success: true, message: `Successfully marked`, data:newAttendence });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: `Internal Server error ${err}` });
  }
};

const getAttendence = async (req, res) => {
  try {
    const { studentId } = req.params;
    const attendance = await Attendence.find({ student: studentId }).populate(
      "student"
    );
    res.status(200).json({
      success: true,
      message: "Successfully get the response",
      attendance,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: `Internal Server error ${err}` });
  }
};

const checkAttendence = async (req, res) => {
  try {
    const today = moment().startOf("day");
    const attendanceForToday = await Attendence.findOne({
      class: req.params.classId,
      date: {
        $gte: today.toDate(),
        $lt: moment(today).endOf("day").toDate(),
      },
    });
    if (attendanceForToday) {
      return res
        .status(200)
        .json({ attendenceTaken: true, message: "Attendence Already taken" });
    } else {
      return res
        .status(404)
        .json({
          attendenceTaken: false,
          message: "Attendence not taken for today",
        });
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: `Internal Server error ${err}` });
  }
};

module.exports = { markattendance, getAttendence,checkAttendence };
