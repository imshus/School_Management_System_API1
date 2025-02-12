const Schedule = require("../models/schedule.model");

const getAllScheduleWithClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const schoolId = req.user.schoolId;
    const schedule = await Schedule.find({ school: schoolId, class: classId }).populate(['teacher','subject']);
    res.status(200).json({
      success: true,
      message: "Successfull excess all data",
      data: schedule,
    });
  } catch(err) {
    res
      .status(500)
      .json({ success: false, message: `Internal server error ${err}` });
  }
};
const createSchedule = async (req, res) => {
  try {
    const newSchedule = new Schedule({
      school: req.user.schoolId,
      date: req.body.date,
      teacher: req.body.teacher,
      subject: req.body.subject,
      class: req.body.class,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });
    const response=await newSchedule.save();
    res.status(200).json({ success: true, message: "successfully created",data:response });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: `Internal server error ${err}` });
  }
};

const getAllScheduleWithId = async (req, res) => {
  try {
    const id = req.params.id;
    const schoolId = req.user.schoolId;
    const schedule = await Schedule.find({ school: schoolId, _id: id }).populate(['teacher','subject']);
    res.status(200).json({
      success: true,
      message: "Successfull excess all data",
      data: schedule,
    });
  } catch(err) {
    res
      .status(500)
      .json({ success: false, message: `Internal server error ${err}` });
  }
};

const updateSchedulewithId = async (req, res) => {
  try {
    let id = req.params.id;
    await Schedule.findOneAndUpdate({ _id: id }, { $set: { ...req.body } });
    const scheduleAfterUpdate = await Schedule.findOne({ _id: id });
    res.status(200).json({
      success: true,
      message: "Schedule Updated",
      date: scheduleAfterUpdate,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: `Internal server error ${err}` });
  }
};

const deleteScheduleWithId = async (req, res) => {
  try {
    const id = req.params.id;
    const schoolId = req.user.schoolId;
    const deletedres = await Schedule.findByIdAndDelete({
      _id: id,
      school: schoolId,
    });
    if (!deletedres) {
      res.status(404).json({ success: false, message: "Id not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Deleted by Id successfull" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: `Internal server error ${err}` });
  }
};

module.exports = {
  getAllScheduleWithClass,
  createSchedule,
  updateSchedulewithId,
  deleteScheduleWithId,
  getAllScheduleWithId,
};
