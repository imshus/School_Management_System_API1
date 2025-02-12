require("dotenv").config();
const formidable = require("formidable");
const School = require("../models/school.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const registerSchool = async (req, res) => {
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
      const existingStudent = await School.findOne({ email: fields.email[0] });

      if (existingStudent) {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        });
      }

      if (!files.school_image || !files.school_image[0]) {
        return res.status(400).json({
          success: false,
          message: "School image is required",
        });
      }
      const photo = files.school_image[0];
      const originalFilename = photo.originalFilename.replace(" ", "_");
      const localFilePath = photo.filepath;

      const cloudinaryResult = await cloudinary.uploader.upload(localFilePath, {
        folder: process.env.CLOUDINARY_UPLOAD_FOLDER,
        public_id: originalFilename.split(".")[0],
      });

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(fields.password[0], salt);

      const newSchool = new School({
        school_name: fields.school_name[0],
        email: fields.email[0],
        owner_name: fields.owner_name[0],
        school_image: cloudinaryResult.secure_url,
        password: hashedPassword,
      });

      const savedSchool = await newSchool.save();

      res.status(201).json({
        success: true,
        data: {
          _id: savedSchool._id,
          school_name: savedSchool.school_name,
          email: savedSchool.email,
          owner_name: savedSchool.owner_name,
          school_image: savedSchool.school_image,
        },
        message: "School registered successfully",
      });
    } catch (error) {
      console.error("Registration Error:", error);
      res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
      });
    }
  });
};

const loginSchool = async (req, res) => {
  try {
    const school = await School.findOne({ email: req.body.email });
    if (school) {
      const isAuth = bcrypt.compareSync(req.body.password, school.password);
      if (isAuth) {
        const jwtSecret = process.env.JWT_SECRET;
        const token = jwt.sign(
          {
            id: school._id,
            schoolId: school._id,
            school_name: school.school_name,
            owner_name: school.owner_name,
            image_url: school.school_image,
            role: "SCHOOL",
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
            id: school._id,
            schoolId: school._id,
            school_name: school.school_name,
            owner_name: school.owner_name,
            image_url: school.school_image,
            role: "SCHOOL",
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

const getAllSchool = async (req, res) => {
  try {
    const schools = await School.find().select([
      "-password",
      "-_id",
      "-email",
      "-owner_name",
      "-createAt",
    ]);
    res.status(200).json({
      success: true,
      message: "Success in fetching all school data",
      schools,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: `Internal Server Error ${err}` });
  }
};

const getSchoolOwnData = async (req, res) => {
  try {
    const id = req.user.id;
    const school = await School.findOne({ _id: id });
    if (school) {
      res.status(200).json({ success: true, school });
    } else {
      res
        .status(404)
        .json({ success: false, message: `School is not found ${err}` });
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: `Internal Server Error ${err}` });
  }
};

const updateSchool = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Error parsing form data",
        });
      }

      const { id } = req.user;
      const school = await School.findById(id);

      if (!school) {
        return res.status(404).json({
          success: false,
          message: "School not found",
        });
      }

      if (!files.image || !files.image[0]) {
        return res.status(400).json({
          success: false,
          message: "No image file provided",
        });
      }

      const photo = files.image[0];

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
          folder: process.env.CLOUDINARY_UPLOAD_FOLDER,
          public_id: `school_${id}_${Date.now()}`,
          resource_type: "auto",
        }
      );

      if (school.cloudinary_public_id) {
        await cloudinary.uploader.destroy(school.cloudinary_public_id);
      }

      school.school_image = cloudinaryResult.secure_url;
      school.cloudinary_public_id = cloudinaryResult.public_id;

      await school.save();

      res.status(200).json({
        success: true,
        data: {
          school_image: school.school_image,
        },
        message: "School image updated successfully",
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

module.exports = {
  registerSchool,
  loginSchool,
  getAllSchool,
  getSchoolOwnData,
  updateSchool,
};
