import express from "express";
import homeController from "../controllers/homeController"
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";
import { name } from "ejs";
let Router = express.Router();
let initWebRoute = (app) => {
    Router.get('/', homeController.getHomeController);
    Router.get('/crud', homeController.getCRUD);
    Router.post('/post-crud', homeController.postCRUD);
    Router.post('/edit-crud', homeController.editCRUD);
    Router.get('/get-crud', homeController.getDisPlayCRUD);
    Router.get('/getEdit-crud', homeController.getEditCRUD);
    Router.post('/postEdit-crud', homeController.postEditCRUD);
    Router.post('/delete-crud', homeController.getDeleteCRUD);


    Router.post('/api/login', userController.handleLogin);
    Router.get('/api/getAllUser-crud', userController.handleGetAllUser)
    Router.post('/api/create-new-user', userController.handleCreateNewUser)
    Router.delete('/api/delete-user', userController.handleDeleteUser)
    Router.put('/api/edit-user', userController.handleEditUser)
    // Router.get('/api/detail-user', userController.handleGetDetailUser)


    Router.get('/api/allcodes', userController.getAllCodes);

    Router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    Router.get('/api/get-all-doctor', doctorController.getAllDocotor);
    Router.post('/api/save-infor-doctor', doctorController.postInforDoctor);
    Router.get('/api/detail-user', doctorController.getDetailDoctor)
    Router.get('/api/get-details-doctor', doctorController.getDetailsDoctorById);
    Router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule)
    Router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);
    Router.get('/api/get-more-infor-doctor', doctorController.getMoreInforDoctor)
    Router.get('/api/get-profile-infor-doctor', doctorController.getProfileInforDoctor)
    Router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor)
    Router.post('/api/sending-remedy', doctorController.sendingRemedy)


    Router.post('/api/patient-booking-appointment', patientController.postBookingAppointment)
    Router.get('/api/patient-confirm-booking', patientController.getConfirmBooking);
    Router.post('/api/verify-booking-appointment', patientController.postVerifyBookingAppointment)

    Router.post('/api/specialty-save-infor', specialtyController.postSpecialtySaveInfor)
    Router.get('/api/fetch-specialty-infor', specialtyController.getAllSpecialty)
    Router.post('/api/handle-delete-specialty', specialtyController.handleDeleteSpecialty);
    Router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);

    Router.post('/api/create-new-clinic', clinicController.handleCreateNewClinic);

    Router.get('/api/get-all-clinic', clinicController.getAllClinic);
    Router.post('/api/delete-clinic', clinicController.handleDeleteClinic);
    Router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById)
    return app.use('/', Router);

};
module.exports = initWebRoute;