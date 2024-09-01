import db from "../models";
import { v4 as uuidv4 } from 'uuid';

import emailService from './emailService';

require('dotenv').config();
let buidUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verifly-booking?token=${token}&doctorId=${doctorId}`
    return result
}
let postBookingAppointmentService = (dataInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('ccheck data input', dataInput)
            if (!dataInput.email || !dataInput.doctorId || !dataInput.timeType
                || !dataInput.fullName
                || !dataInput.address
                || !dataInput.selectedGender

            ) {

                resolve({
                    errorCode: 1,
                    errorMess: "Missing required parameter!"
                })
            }
            else {
                let token = uuidv4();

                await emailService.sendSimpleEmail({
                    receiverEmail: dataInput.email,
                    patientName: dataInput.fullName,
                    time: dataInput.timeString,
                    doctorName: dataInput.doctorName,
                    language: dataInput.language,
                    redirecLink: buidUrlEmail(dataInput.doctorId, token)
                })

                //upsert patient
                let user = await db.User.findOrCreate({
                    where: {
                        email: dataInput.email
                    },
                    defaults: {
                        email: dataInput.email,
                        roleId: "R3",
                        address: dataInput.address,
                        gender: dataInput.selectedGender,
                        firstName: dataInput.fullName
                    },
                    raw: true
                });
                // create a booking record
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patienId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: dataInput.doctorId,
                            patienId: user[0].id,
                            date: dataInput.date,
                            timeType: dataInput.timeType,
                            token: token
                        },

                    })
                }
                resolve({
                    errorCode: 0,
                    errorMess: 'Oke La!'
                })
            }
        } catch (error) {
            reject(error);
        }
    });
}
let getConfirmBookingService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email) {

                resolve({
                    errorCode: 1,
                    errorMess: "Missing required parameter!"
                })
            } else {
                let data = await db.Booking.findOne({
                    where: {
                        email: data.email
                    }
                })
                if (!data) {
                    resolve({

                        errorCode: 1,
                        errorMess: "Not found any schedule booking! "

                    })
                }
                resolve({

                    errorCode: 0,
                    errorMess: "O ke!",
                    data: data

                })


            }

        } catch (error) {
            reject(error);
        }
    });
};
let postVerifyBookingAppointmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {

                resolve({
                    errorCode: 1,
                    errorMess: "Missing required parameter!"
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        token: data.token,
                        doctorId: data.doctorId,
                        statusId: 'S1'
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S2'
                    await appointment.save()
                    resolve({
                        errorCode: 0,
                        errorMess: "Update appointment success!"
                    })

                } else {
                    resolve({
                        errorCode: 2,
                        errorMess: "Apointment has been activated or dose not exist!"
                    })
                }
            }
        } catch (error) {
            reject(error);
        }

    })
};


module.exports = {
    postBookingAppointmentService,
    getConfirmBookingService, postVerifyBookingAppointmentService
}