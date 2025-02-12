const Subject = require("../models/subject.model");

const getAllsubject = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const allSubject = await Subject.find({ school: schoolId });
    res.status(200).json({
      success: true,
      message: "Successfull excess all data",
      data: allSubject,
    });
  } catch {
    res
      .status(500)
      .json({ success: false, message: `Internal server error ${err}` });
  }
};

const createSubject = async (req, res) => {
  try {
    const newSubject = new Subject({
      school: req.user.schoolId,
      subject_name: req.body.subject_name,
      subject_codename: req.body.subject_codename,
    });
    await newSubject.save();
    res.status(200).json({ success: true, message: "successfully created" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: `Internal server error ${err}` });
  }
};

const updateSubjectwithId = async (req, res) => {
  try {
    let id = req.params.id;
    await Subject.findOneAndUpdate({ _id: id }, { $set: { ...req.body } });
    const subjectAfterUpdate = await Subject.findOne({ _id: id });
    res.status(200).json({
      success: true,
      message: "Subject Updated",
      date: subjectAfterUpdate,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: `Internal server error ${err}` });
  }
};

const deleteSubjectWithId = async (req, res) => {
  try {
    const id = req.params.id;
    const schoolId = req.user.schoolId;
    if (
       true
    ) {
      const deletedres = await Subject.findByIdAndDelete({
        _id: id,
        school: schoolId,
      });
      if (!deletedres) {
        res.status(404).json({ success: false, message: "Id not found" });
      }
      res
        .status(200)
        .json({ success: true, message: "Deleted by Id successfull" });
    } else {
      res
        .status(501)
        .json({ success: false, message: "Internal server error" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: `Internal server error ${err}` });
  }
};

module.exports = {
  createSubject,
  updateSubjectwithId,
  deleteSubjectWithId,
  getAllsubject,
};
