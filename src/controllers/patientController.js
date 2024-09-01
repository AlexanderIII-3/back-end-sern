import { json } from "body-parser";
import patientService from "../service/patientService";
let postBookingAppointment = async (req, res) => {
    try {
        let data = await patientService.postBookingAppointmentService(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: -1,
            errorMess: "Error from Server!"
        });

    }
};
let getConfirmBooking = async (req, res) => {
    try {
        let confirm = await patientService.getConfirmBookingService(req.email)
        return res.status(200).json('o hi hi :))');
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: -1,
            errorMess: "Error from Server!"
        });

    }
};
let postVerifyBookingAppointment = async (req, res) => {

    try {
        // console.log('check data from server1', req.body)
        let confirm = await patientService.postVerifyBookingAppointmentService(req.body)
        return res.status(200).json(confirm);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: -1,
            errorMess: "Error from Server!"
        });

    }
};
module.exports = {
    postBookingAppointment,
    getConfirmBooking, postVerifyBookingAppointment
}