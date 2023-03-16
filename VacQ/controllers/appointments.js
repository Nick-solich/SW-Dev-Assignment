const Appointment = require("../models/Appointment");

//@desc     Get all appointments
//@route    GET /api/v1/appointments
//@access   Private
exports.getAppointments = async (req, res, next) => {
  let query;
  //General users can only see their own appointments!
  if (req.user.role !== "admin") {
    query = Appointment.find({ user: req.user.id });
  } else {
    query = Appointment.find();
  }
  try {
    const appointments = await query;
    res
      .status(200)
      .json({ success: true, count: appointments.length, data: appointments });
  } catch (err) {
    console.log(err.stack);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Appointment" });
  }
};
