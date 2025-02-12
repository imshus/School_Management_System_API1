require("dotenv").config();
const formidable = require("formidable");
const Teacher = require("../models/teacher.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const registerTeacher = async (req, res) => {
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
      const existingTeacher = await Teacher.findOne({ email: fields.email[0] });

      if (existingTeacher) {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        });
      }

      if (!files.teacher_image || !files.teacher_image[0]) {
        return res.status(400).json({
          success: false,
          message: "Teacher image is required",
        });
      }
      const photo = files.teacher_image[0];
      const originalFilename = photo.originalFilename.replace(" ", "_");
      const localFilePath = photo.filepath;

      const cloudinaryResult = await cloudinary.uploader.upload(localFilePath, {
        folder: process.env.CLOUDINARY_UPLOAD_FOLDER_TEACHER,
        public_id: originalFilename.split(".")[0],
      });

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(fields.password[0], salt);

      const newTeacher = new Teacher({
        school: req.user.schoolId,
        email: fields.email[0],
        name: fields.name[0],
        qualification:fields.qualification[0],
        age: fields.age[0],
        gender: fields.gender[0],
        teacher_image: cloudinaryResult.secure_url,
        password: hashedPassword,
      });

      const savedTeacher = await newTeacher.save();

      res.status(201).json({
        success: true,
        data: {
          _id: savedTeacher._id,
          email: savedTeacher.email,
          name: savedTeacher.name,
          qualification: savedTeacher.qualification,
          age: savedTeacher.age,
          gender: savedTeacher.gender,
          teacher_image: savedTeacher.student_image,
        },
        message: "Teacher registered successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
      });
    }
  });
};

const loginTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ email: req.body.email });
    if (teacher) {
      const isAuth = bcrypt.compareSync(req.body.password, teacher.password);
      if (isAuth) {
        const jwtSecret = process.env.JWT_SECRET;
        const token = jwt.sign(
          {
            id: teacher._id,
            schoolId: teacher.school,
            name: teacher.name,
            image_url: teacher.teacher_image,
            role: "TEACHER",
          },
          jwtSecret,
          {
            expiresIn:'1h'
          }
        );
        res.header("Authentication", token);
        res.status(200).json({
          success: true,
          message: "Success Login",
          user: {
            id: teacher._id,
            schoolId: teacher.school,
            teacher_name: teacher.name,
            owner_name: teacher.owner_name,
            image_url: teacher.student_image,
            role: "TEACHER",
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

const getTeacherWithQuery = async (req, res) => {
  try {
    const filterQuery = {};
    const schoolId = req.user.schoolId;
    filterQuery["school"] = schoolId;

    if (req.query.hasOwnProperty("search")) {
      filterQuery["name"] = { $regex: req.query.search, $options: "i" };
    }
    if (req.query.hasOwnProperty("_id")) {
      filterQuery["_id"] = req.query._id;
    }
    const teacher = await Teacher.find(filterQuery).select(["-password"]);
    res.status(200).json({
      success: true,
      message: "Success in fetching all teacher data",
      teacher,
    });
  } catch (err) {
    res 
      .status(500)
      .json({ success: false, message: `Internal Server Error ${err}` });
  }
};

const getTeacherOwnData = async (req, res) => {
  try {
    const id = req.user.id;
    const schoolId = req.user.schoolId;
    const teacher = await Teacher.findOne({ _id: id, school: schoolId }).select(['-password']);
    if (teacher) {
      res.status(200).json({ success: true, teacher });
    } else {
      res
        .status(404)
        .json({ success: false, message: `Teacher is not found ${err}` });
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: `Internal Server Error ${err}` });
  }
};

const fetchTeacherWithId = async (req, res) => {
  try {
    const id = req.params.id;
    const schoolId = req.user.schoolId;
    const teacher = await Teacher.findOne({ _id: id, school: schoolId });
    if (teacher) {
      res.status(200).json({ success: true, teacher });
    } else {
      res
        .status(404)
        .json({ success: false, message: `Teacher is not found ${err}` });
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: `Internal Server Error ${err}` });
  }
};

const updateTeacherWithId = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Error parsing form data",
        });
      }

      if (!files.teacher_image || !files.teacher_image[0]) {
        return res.status(400).json({
          success: false,
          message: "No image file provided",
        });
      }
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(fields.password[0], salt);

      const newTeacher = {
        email: fields.email[0],
        name: fields.name[0],
        qualification:fields.qualification[0],
        age: fields.age[0],
        gender: fields.gender[0],
        password: hashedPassword,
      };
      
      const id = req.params.id;
      const teacher = await Teacher.findByIdAndUpdate(
        id,         
        newTeacher, 
        { new: true } 
      );
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: "Teacher not found",
        });
      }
      const photo = files.teacher_image[0];

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
          folder: process.env.CLOUDINARY_UPLOAD_FOLDER_TEACHER,
          public_id: `student_${id}_${Date.now()}`,
          resource_type: "auto",
        }
      );

      if (teacher.cloudinary_public_id) {
        await cloudinary.uploader.destroy(teacher.cloudinary_public_id);
      }

      teacher.teacher_image = cloudinaryResult.secure_url;
      teacher.cloudinary_public_id = cloudinaryResult.public_id;

      await teacher.save();

      res.status(200).json({
        success: true,
        data: newTeacher,
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

const deleteTeacherwithId = async (req, res) => {
  try {
    const id = req.params.id;
    const schoolId = req.user.schoolId;
    await Teacher.findOneAndDelete({ _id: id, school: schoolId });
    const teacher = await Teacher.find({ school: schoolId });
    res
      .status(200)
      .json({ success: true, message: "student deleted", teacher });
  } catch {
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

module.exports = {
  registerTeacher,
  loginTeacher,
  getTeacherWithQuery,
  getTeacherOwnData,
  updateTeacherWithId,
  deleteTeacherwithId,
  fetchTeacherWithId,
}
