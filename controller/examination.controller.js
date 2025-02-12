const Examination = require("../models/examination.model");

const newExamination = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const { date, subjectId, examType, classId } = req.body;
    const newExamination = new Examination({
      school: schoolId,
      examDate: date,
      subject: subjectId,
      examType: examType,
      class: classId
    });
    const saveData = await newExamination.save();
    res.status(200).json({
      success: true,
      message: "Success in creating new Examination",
      data: saveData,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: "false", message: `Internal Server Error ${err}` });
  }
};

const getAllExamination = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const examinations = await Examination.find({ school: schoolId });
    res.status(200).json({ success: true,message:'successfully fetch all data',data:examinations });
  } catch (err) {
    res
      .status(500)
      .json({
        success: "false",
        message: `Error in Fetching Examination ${err}`,
      });
  }
};

const getExaminationByClass = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const classId = req.params.id;
    const examination = await Examination.find({
      class: classId,
      school: schoolId,
    }).populate('subject');
    res.status(200).json({ success: true, data:examination });
  } catch (err) {
    res
      .status(500)
      .json({
        success: "false",
        message: `Error in Fetching Examination ${err}`,
      });
  }
};

const updateExaminationWithId = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const id = req.params.id;
    const { date, subjectId, examType } = req.body;
    await Examination.findOneAndUpdate(
      { _id: id, school: schoolId },
      {
        $set: {
          examDate: date,
          subject: subjectId,
          examType: examType,
        },
      }
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Updated Examination with id"
      });
  } catch (err) {
    res
      .status(500)
      .json({
        success: "false",
        message: `Error in Fetching UpdatedExamination Data with Id ${err}`,
      });
  }
};

const deleteexaminationwithId=async(req,res)=>{
    try{
        const id=req.params.id
        const schoolId=req.user.schoolId

        await Examination.findOneAndDelete({_id:id,school:schoolId})
        res
      .status(200)
      .json({
        success: true,
        message: "Deleted Examination Successfully with id"
      });

    }catch(err){
        res
        .status(500)
        .json({
          success: "false",
          message: `Error in deleting Examination Data with Id ${err}`,
        });
    }
}
module.exports = {
  newExamination,
  getAllExamination,
  getExaminationByClass,
  updateExaminationWithId,
  deleteexaminationwithId
};
