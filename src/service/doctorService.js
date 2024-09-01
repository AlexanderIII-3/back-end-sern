
import { where } from "sequelize";
import db from "../models";
require('dotenv').config();
import _, { includes } from "lodash";
import { raw } from "body-parser";
import emailService from './emailService'
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
let getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({

                limit: limit,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password'],
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: true,
                nest: true,
            })
            if (users) {
                resolve({
                    errorCode: 0,
                    errorMess: 'O ke!',
                    data: users
                })
            }

        } catch (error) {
            reject(error);
        }
    })
}
let getDetailDoctorService = (idInput) => {
    return new Promise(async (resolve, reject) => {

        try {
            let id = idInput.id;
            let users = await db.User.findOne({
                where: { id: id },
                attributes: {
                    exclude: ['password'],
                },
                raw: true
            })
            if (users) {
                resolve({
                    errorCode: 0,
                    errorMess: 'O ke!',
                    data: users
                })
            } else {
                resolve({
                    errorCode: -1,
                    errorMess: 'Missing parameters!',
                    data: []
                })
            }

        } catch (error) {
            reject(error);
        }
    })
}
let getAllDocotor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image'],
                },



            })
            resolve({
                errorCode: 0,
                errorMess: 'O ke!',
                data: doctor
            })
        } catch (error) {
            reject(error);
        }
    })

}
let checkRequiredFields = (inputData) => {
    let arrFields = ['id', 'contentHtml', 'contentMarkDown', 'action',
        'selectedPrice', 'selectedPayment', 'selectedProvince',
        'nameClinic', 'addressClinic', 'specialtyId', 'clinicId',
        'note'
    ];
    let element = '';
    let isValid = true;
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false;
            element = arrFields[i];
            break;
        }
    }
    return {
        isValid: isValid,
        element: element,
    }
}
let postInforDoctorSevice = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkOjb = checkRequiredFields(inputData);
            if (checkOjb.isValid === false) {
                resolve({
                    errorCode: 1,
                    errorMess: `Missing parameter: ${checkOjb.element}`
                })
            }


            else {
                //upsert markdown 
                if (inputData.action === 'CREATE') {
                    await db.MarkDown.create({
                        contentHtml: inputData.contentHtml,
                        contenMarkdown: inputData.contentMarkDown,
                        description: inputData.description,
                        doctorId: inputData.id,

                    })
                }
                else if (inputData.action === 'EDIT') {

                    let doctorMarkdown = await db.MarkDown.findOne({
                        where: { doctorId: inputData.id },
                        raw: false
                    });
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHtml = inputData.contentHtml;
                        doctorMarkdown.contenMarkdown = inputData.contentMarkDown;
                        doctorMarkdown.description = inputData.description;
                        await doctorMarkdown.save()
                    }





                }
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputData.id

                    },
                    raw: false

                })
                if (doctorInfor) {
                    //upadate 

                    doctorInfor.priceId = inputData.selectedPrice;
                    doctorInfor.paymentId = inputData.selectedPayment;
                    doctorInfor.provinceId = inputData.selectedProvince;

                    doctorInfor.nameClinic = inputData.nameClinic;
                    doctorInfor.addressClinic = inputData.addressClinic;
                    doctorInfor.note = inputData.note;
                    doctorInfor.specialtyId = inputData.specialtyId;
                    doctorInfor.clinicId = inputData.clinicId

                    await doctorInfor.save()

                } else {
                    // create
                    await db.Doctor_Infor.create({
                        priceId: inputData.selectedPrice,
                        paymentId: inputData.selectedPayment,
                        provinceId: inputData.selectedProvince,
                        doctorId: inputData.id,

                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId


                    })
                }
                resolve({
                    errorCode: 0,
                    errorMess: 'O Ke'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getDetailsDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errorCode: -1,
                    errorMess: 'Missing parameter!'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password'],
                    },
                    include: [
                        {
                            model: db.MarkDown,
                            attributes: ['description', 'contentHtml', 'contenMarkdown']
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },

                            ]
                        },

                    ],
                    raw: false,
                    nest: true,
                })

                if (data && data.image) {
                    // var hex = new Buffer.from(bin, 'base64').toString('hex');

                    data.image = new Buffer.from(data.image, 'base64').toString('binary')

                }
                if (!data) data = {};
                resolve({
                    errorCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}
let bulkCreateScheduleService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errorCode: 1,
                    errorMess: "Missing required parameters!"
                })
            } else {
                let schedule = data.arrSchedule;
                // inserr maxNumber
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        // item.timeType = item.timeType; 
                        return item;
                    })
                }
                console.log('check schedule', schedule)
                // get all existing
                let existing = await db.Schedule.findAll(
                    {
                        where: { doctorId: data.doctorId, date: data.date },
                        attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                        raw: true
                    }

                );


                console.log('check item map existing', existing)

                // compare different dates
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;

                });
                // create data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);

                }
                console.log('to creat', toCreate)


                resolve({
                    errorCode: 0,
                    errorMess: "O Ke!",

                })
            }

        } catch (error) {
            reject(error);
        }
    })
};
let getScheduleByDateService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        if (!doctorId || !date) {
            resolve({
                errorCode: 0,
                errorMess: 'Missing required parameter! '
            })
        } else {
            let data = await db.Schedule.findAll({
                where: {
                    doctorId: doctorId,
                    date: date
                },
                include: [
                    { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] }
                ],
                raw: true,
                nest: true,
            })
            if (!data) {
                data = []
            }
            resolve({
                errorCode: 0,
                errorMess: 'O ke!',
                data: data
            })
        }
    })

};
let getMoreInforDoctorService = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errorCode: 1,
                    errorMess: 'Missing required parameter!'
                })
            }
            else {
                let res = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: doctorId

                    },



                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },

                    ],

                    raw: true,
                    nest: true





                })
                if (!res) {
                    res = {};
                }
                resolve({
                    errorCode: 0,
                    errorMess: 'O ke!',
                    data: res
                })
            }




        } catch (error) {
            reject(error)
        }
    })
};
let getProfileInforDoctorService = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errorCode: 1,
                    errorMess: "Missing required parameter!"
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password'],
                    },
                    include: [
                        {
                            model: db.MarkDown,
                            attributes: ['description',]
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },

                            ]
                        },

                    ],
                    raw: false,
                    nest: true,
                })

                if (data && data.image) {
                    // var hex = new Buffer.from(bin, 'base64').toString('hex');

                    data.image = new Buffer.from(data.image, 'base64').toString('binary')

                }
                if (!data) data = {};
                resolve({
                    errorCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error);
        }
    });
};
let getListPatientForDoctorService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errorCode: 1,
                    errorMess: 'Missing required parameter!'
                })
            }
            else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date

                    },
                    include: [
                        {
                            model: db.User, as: 'patientData',
                            attributes: ['email', 'firstName', 'address', 'gender'],
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },

                            ]
                        },
                        {
                            model: db.Allcode, as: 'timeBookingData', attributes: ['valueEn', 'valueVi'],
                        }
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errorCode: 0,
                    errorMess: "Ô KÊ!",
                    data: data
                })
            }




        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
};
let sendingRemedyService = (dataInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!dataInput.email || !dataInput.patientId || !dataInput.doctorId ||
                !dataInput.timeType || !dataInput.image) {
                resolve({
                    errorCode: 1,
                    errorMess: 'Missing required parameter1!'
                })


            }
            else {
                // update patient status
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: dataInput.doctorId,
                        patienId: dataInput.patientId,
                        timeType: dataInput.timeType,
                        statusId: 'S2'
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = "S3"
                    await appointment.save()
                }
                //sending remedy
                await emailService.sendAttachment(dataInput);
                resolve({
                    errorCode: 0,
                    errorMess: "Ô KÊ!",
                })
            }




        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
};
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getDetailDoctorService,
    getAllDocotor, postInforDoctorSevice,
    getDetailsDoctorById, bulkCreateScheduleService,
    getScheduleByDateService, getMoreInforDoctorService,
    getProfileInforDoctorService, getListPatientForDoctorService,
    sendingRemedyService
}