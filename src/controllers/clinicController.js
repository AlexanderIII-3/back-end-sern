import { json } from "body-parser";
import clinicService from "../service/clinicService";
let handleCreateNewClinic = async (req, res) => {
    try {
        let data = await clinicService.handleCreateNewClinicService(req.body)
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);

        return res.status(200).json({
            errorCode: 2,
            errorMess: 'Error From Server!'
        })
    }
};
let getAllClinic = async (req, res) => {
    try {
        let data = await clinicService.getAllClinicService();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({
            errorCode: 2,
            errorMess: 'Error From Server!'
        })
    }
}
let handleDeleteClinic = async (req, res) => {
    try {
        let data = await clinicService.handleDeleteClinicService(req.body.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);

        return res.status(200).json({
            errorCode: 2,
            errorMess: 'Error From Server!'
        })
    }
};
let getDetailClinicById = async (req, res) => {
    try {
        let data = await clinicService.getDetailClinicByIdService(req.query.id);
        console.log('check data qurey', data)
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: 2,
            errorMess: 'Error From Server!'
        })
    }
};
module.exports = {
    handleCreateNewClinic, getAllClinic,
    handleDeleteClinic, getDetailClinicById

}