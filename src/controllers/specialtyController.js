import { json } from "body-parser";
import specialtyService from "../service/specialtyService";
let postSpecialtySaveInfor = async (req, res) => {
    try {
        console.log('check data form server', req.body);
        let data = await specialtyService.postSpecialtySaveInforService(req.body);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);

        return res.status(200).json({
            errorCode: 2,
            errorMess: 'Error From Server!'
        })
    }
};
let getAllSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.getAllSpecialtyService();
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errorCode: 1,
            errorMess: 'Error From Server!'
        })
    }
}
let handleDeleteSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.handleDeleteSpecialtyService(req.query.id);
        return res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({
            errorCode: 1,
            errorMess: 'Error From Server!'
        })

    }
};
let getDetailSpecialtyById = async (req, res) => {
    try {
        let data = await specialtyService.getDetailSpecialtyByIdService(req.query.id, req.query.location);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errorCode: 1,
            errorMess: 'Error From Server!'
        })

    }
};
module.exports = {
    postSpecialtySaveInfor,
    getAllSpecialty,
    handleDeleteSpecialty, getDetailSpecialtyById
}