const Notice = require("../models/notice.model");


const getAllNotices = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const allNotices = await Notice.find({ school: schoolId });
    res.status(200).json({
      success: true,
      message: "Successfull excess all data",
      data: allNotices,
    });
  } catch {
    res
      .status(500)
      .json({ success: false, message: `Internal server error ${err}` });
  }
};

const getAllNoticesForTeacher = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const allNotices = await Notice.find({ school: schoolId,audience:'Teacher' });
    res.status(200).json({
      success: true,
      message: "Successfull excess all data",
      data: allNotices,
    });
  } catch {
    res
      .status(500)
      .json({ success: false, message: `Internal server error ${err}` });
  }
};

const getAllNoticesForStudent = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const allNotices = await Notice.find({ school: schoolId,audience:'Student' });
    res.status(200).json({
      success: true,
      message: "Successfull excess all data",
      data: allNotices,
    });
  } catch {
    res
      .status(500)
      .json({ success: false, message: `Internal server error ${err}` });
  }
};

const createNotice = async (req, res) => {
  try {
    const {title,audience,message}=req.body
    const newNotice = new Notice({
      school: req.user.schoolId,
      title: title,
      audience:audience,
      message:message
    });
    await newNotice.save();
    res.status(200).json({ success: true, message: "successfully created" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: `Internal server error ${err}` });
  }
};

const updateNoticewithId = async (req, res) => {
  try {
    let id = req.params.id;
    await Notice.findOneAndUpdate({ _id: id }, { $set: { ...req.body } });
    const noticeAfterUpdate = await Notice.findOne({ _id: id });
    res.status(200).json({
      success: true,
      message: "Notice Updated",
      data: noticeAfterUpdate,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: `Internal server error ${err}` });
  }
};



const deleteNoticeWithId = async (req, res) => {
  try {
    const id = req.params.id;
    const schoolId = req.user.schoolId;
   
      const deletedres = await Notice.findByIdAndDelete({
        _id: id,
        school: schoolId,
      });
      if (!deletedres) {
        res.status(404).json({ success: false, message: "Id not found" });
      }
      res
        .status(200)
        .json({ success: true, message: "Deleted by Id successfull" });
      }
   catch (err) {
    res
      .status(500)
      .json({ success: false, message: `Internal server error ${err}` });
  }
};

module.exports = {
  createNotice,
  updateNoticewithId,
  deleteNoticeWithId,
  getAllNotices,
  getAllNoticesForStudent,
  getAllNoticesForTeacher
};
