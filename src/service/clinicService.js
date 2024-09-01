

import { raw } from "body-parser";
import db from "../models";
import { where } from "sequelize";


require('dotenv').config();
let handleCreateNewClinicService = (dataInput) => {
    return new Promise(async (resolve, reject) => {

        try {
            if (!dataInput.name
                || !dataInput.descriptionMarkDown
                || !dataInput.descriptionHtml
                || !dataInput.image
                || !dataInput.address
                || !dataInput.action
            ) {
                resolve({
                    errorCode: 1,
                    errorMess: "Missing required parameter!"
                })
            }
            else {

                if (dataInput.action === 'CREATE') {
                    await db.Clinic.create({
                        name: dataInput.name,
                        image: dataInput.image,
                        address: dataInput.address,
                        descriptionMarkDown: dataInput.descriptionMarkDown,
                        descriptionHtml: dataInput.descriptionHtml

                    });
                    resolve({
                        errorCode: 0,
                        errorMess: "O ke!",

                    })
                }
                if (dataInput.action === 'EDIT') {
                    await db.Clinic.create({
                        name: dataInput.name,
                        image: dataInput.image,
                        address: dataInput.address,
                        descriptionMarkDown: dataInput.descriptionMarkDown,
                        descriptionHtml: dataInput.descriptionHtml

                    });
                    resolve({
                        errorCode: 0,
                        errorMess: "O ke!",

                    })
                }


            }




        } catch (error) {
            reject(error);
        }
    });
}
let getAllClinicService = () => {
    return new Promise(async (resolve, reject) => {

        try {

            let res = await db.Clinic.findAll({
                raw: true,

            });
            if (res && res.length > 0) {
                res.map(item => {
                    item.image = new Buffer.from(item.image, 'base64').toString('binary')
                    return item;

                })


            }
            resolve({
                errorCode: 0,
                errorMess: "O ke!",
                data: res

            })

        } catch (error) {
            reject(error);
        }





    });
};
let handleDeleteClinicService = (id) => {
    return new Promise(async (resolve, reject) => {

        try {

            await db.Clinic.destroy({
                where: {
                    id: id
                }

            });

            resolve({
                errorCode: 0,
                errorMess: "O ke!",

            })

        } catch (error) {
            reject(error);
        }





    });
};
let getDetailClinicByIdService = (dataId) => {
    return new Promise(async (resolve, reject) => {

        try {
            if (!dataId) {
                resolve({
                    errorCode: 1,
                    errorMess: "Missing required parameter!"
                })
            }
            else {


                let res = await db.Clinic.findOne({
                    where: { id: dataId },
                    attributes: ['name', 'address', 'descriptionHtml', 'descriptionMarkDown'],
                    raw: true

                })

                if (res) {
                    // query twice
                    let doctorClinic = [];

                    doctorClinic = await db.Doctor_Infor.findAll({
                        where: { clinicId: dataId },
                        attributes: ['doctorId', 'provinceId'],
                        raw: true

                    })
                    res.doctorClinic = doctorClinic;

                } else res = {}
                console.log(res)
                resolve({
                    errorCode: 0,
                    errorMess: "O ke!",
                    data: res

                })

            }
        } catch (error) {
            console.log('check error from service: ', error)
            reject(error);
        }




    });
};
module.exports = {
    handleCreateNewClinicService, getAllClinicService,
    handleDeleteClinicService, getDetailClinicByIdService
}