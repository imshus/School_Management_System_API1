require("dotenv").config();
const formidable = require("formidable");
const Student = require("../models/student.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const registerStudents = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error parsing form data",
        });
      }
      if (!fields.email || !fields.email[0]) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const studetnClassRegister=await Student.countDocuments(fields.student_class[0])

      const existingStudent = await Student.findOne({ email: fields.email[0] });
      if (existingStudent) {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        });
      }

      if (!files.student_image || !files.student_image[0]) {
        return res.status(400).json({
          success: false,
          message: "Student image is required",
        });
      }
      const photo = files.student_image[0];
      const originalFilename = photo.originalFilename.replace(" ", "_");
      const localFilePath = photo.filepath;

      const cloudinaryResult = await cloudinary.uploader.upload(localFilePath, {
        folder: process.env.CLOUDINARY_UPLOAD_FOLDER_STUDENT,
        public_id: originalFilename.split(".")[0],
      });

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(fields.password[0], salt);

      const newStudent = new Student({
        school: req.user.schoolId,
        email: fields.email[0],
        name: fields.name[0],
        student_class: fields.student_class[0],
        age: fields.age[0],
        gender: fields.gender[0],
        guardian: fields.guardian[0],
        guardian_phone: fields.guardian_phone[0],
        student_image: cloudinaryResult.secure_url,
        password: hashedPassword,
      });
      
      let savedStudent={}

      if(studetnClassRegister<=60){
        savedStudent = await newStudent.save();
      }
      else{
        res.status(429).json({success:'false',message:'Register student per classnot more them 60'})
      }

      res.status(201).json({
        success: true,
        data: {
          _id: savedStudent._id,
          email: savedStudent.email,
          name: savedStudent.name,
          student_class: savedStudent.student_class,
          age: savedStudent.age,
          gender: savedStudent.gender,
          guardian: savedStudent.guardian,
          guardian_photo: savedStudent.guardian_photo,
          student_image: savedStudent.student_image,
        },
        message: "Student registered successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
      });
    }
  });
};

const loginStudents = async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.body.email });
    if (student) {
      const isAuth = bcrypt.compareSync(req.body.password, student.password);
      if (isAuth) {
        const jwtSecret = process.env.JWT_SECRET;
        const token = jwt.sign(
          {
            id: student._id,
            schoolId: student.school,
            name: student.name,
            image_url: student.student_image,
            role: "STUDENT",
          },
          jwtSecret,
          {
            expiresIn:'1h'
          },
        );
        res.header("Authentication", token);
        res.status(200).json({
          success: true,
          message: "Success Login",
          user: {
            id: student._id,
            schoolId: student.school,
            Student_name: student.name,
            owner_name: student.owner_name,
            image_url: student.student_image,
            role: "STUDENT",
          },
        });
      } else {
        res
          .status(401)
          .json({ success: false, message: `password is not matched` });
      }
    } else {
      res
        .status(401)
        .json({ success: false, message: `Email is not register` });
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: `Internal Server Error ${err}` });
  }
};

const getStudentsWithQuery = async (req, res) => {
  try {
    const filterQuery = {};
    const schoolId = req.user.schoolId;
    filterQuery["school"] = schoolId;

    if (req.query.hasOwnProperty("search")) {
      filterQuery["name"] = { $regex: req.query.search, $options: "i" };
    }

    if (req.query.hasOwnProperty("student_class")) {
      filterQuery["student_class"] = req.query.student_class;
    }
    const student = await Student.find(filterQuery).select(["-password"]);
    res.status(200).json({
      success: true,
      message: "Success in fetching all school data",
      student,
    });
  } catch (err) {
    res 
      .status(500)
      .json({ success: false, message: `Internal Server Error ${err}` });
  }
};

const getStudentOwnData = async (req, res) => {
  try {
    const id = req.user.id;
    const schoolId = req.user.schoolId;
    const student = await Student.findOne({ _id: id, school: schoolId }).select(['-password']);
    if (student) {
      res.status(200).json({ success: true, student });
    } else {
      res
        .status(404)
        .json({ success: false, message: `Student is not found ${err}` });
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: `Internal Server Error ${err}` });
  }
};

const fetchStudentsWithId = async (req, res) => {
  try {
    const id = req.user.id;
    const schoolId = req.user.schoolId;
    const student = await Student.findOne({ _id: id, school: schoolId });
    if (student) {
      res.status(200).json({ success: true, student });
    } else {
      res
        .status(404)
        .json({ success: false, message: `Student is not found ${err}` });
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: `Internal Server Error ${err}` });
  }
};


const updateStudentWithId = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Error parsing form data",
        });
      }

      if (!files.student_image || !files.student_image[0]) {
        return res.status(400).json({
          success: false,
          message: "No image file provided",
        });
      }
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(fields.password[0], salt);

      const newStudent = {
        email: fields.email[0],
        name: fields.name[0],
        student_class: fields.student_class[0],
        age: fields.age[0],
        gender: fields.gender[0],
        guardian: fields.guardian[0],
        guardian_phone: fields.guardian_phone[0],
        password:hashedPassword,
      };
      
      const id = req.params.id;
      const student = await Student.findByIdAndUpdate(
        id,         
        newStudent, 
        { new: true } 
      );
      if (!student) {
        return res.status(404).json({
          success: false,
          message: "School not found",
        });
      }
      const photo = files.student_image[0];

      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(photo.mimetype)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid file type. Please upload a JPEG, PNG, or GIF image.",
        });
      }

      const cloudinaryResult = await cloudinary.uploader.upload(
        photo.filepath,
        {
          folder: process.env.CLOUDINARY_UPLOAD_FOLDER_STUDENT,
          public_id: `student_${id}_${Date.now()}`,
          resource_type: "auto",
        }
      );

      if (student.cloudinary_public_id) {
        await cloudinary.uploader.destroy(student.cloudinary_public_id);
      }

      student.student_image = cloudinaryResult.secure_url;
      student.cloudinary_public_id = cloudinaryResult.public_id;

      await student.save();

      res.status(200).json({
        success: true,
        data: newStudent,
        message: "updated successfully",
      });
    } catch (error) {
      console.error("Update Error:", error);
      res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
      });
    }
  });
};

const deleteStudentwithId = async (req, res) => {
  try {
    const id = req.params.id;
    const schoolId = req.user.schoolId;
    await Student.findOneAndDelete({ _id: id, school: schoolId });
    const student = await Student.find({ school: schoolId });
    res
      .status(200)
      .json({ success: true, message: "student deleted", student });
  } catch {
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};
module.exports = {
  registerStudents,
  loginStudents,
  getStudentsWithQuery,
  getStudentOwnData,
  updateStudentWithId,
  deleteStudentwithId,
  fetchStudentsWithId,
}
