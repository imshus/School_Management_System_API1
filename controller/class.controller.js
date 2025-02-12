const Class = require("../models/class.model");

const getAllclasses = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const allClasses = await Class.find({ school: schoolId });
    res.status(200).json({
      success: true,
      message: "Successfull excess all data",
      data: allClasses,
    });
  } catch(err) {
    res
      .status(500)
      .json({ success: false, message: `Internal server error ${err}` });
};
}

const createClass = async (req, res) => {
  try {
    const newClass = new Class({
      school: req.user.schoolId,
      class_text: req.body.class_text,
      class_num: req.body.class_num,
    });
    await newClass.save();
    res.status(200).json({ success: true, message: "successfully created" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: `Internal server error ${err}` });
  }
};

const updateClasswithId = async (req, res) => {
  try {
    let id = req.params.id;
    await Class.findOneAndUpdate({ _id: id }, { $set: { ...req.body } });
    const classAfterUpdate = await Class.findOne({ _id: id });
    res.status(200).json({
      success: true,
      message: "Class Updated",
      data: classAfterUpdate,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: `Internal server error ${err}` });
  }
};

const getSingleclass = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const classId = req.params.id;
    const singleClass = await Class.findOne({ _id: classId, school: schoolId }).populate('attendee');

    if (!singleClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Successfully retrieved class data",
      data: singleClass,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: `Internal server error: ${err}` });
  }
};

const getAttendeeclass = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const attendeeId=req.user.id
    const classes = await Class.find({ attendee:attendeeId, school: schoolId });

    if (!classes) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Successfully retrieved Attendee class data",
      data: classes,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: `Internal server error: ${err}` });
  }
};


const deleteClassWithId = async (req, res) => {
  try {
    const id = req.params.id;
    const schoolId = req.user.schoolId;

    if (
       true
    ) {
      const deletedres = await Class.findByIdAndDelete({
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
  createClass,
  updateClasswithId,
  deleteClassWithId,
  getAllclasses,
  getSingleclass,
  getAttendeeclass
};
