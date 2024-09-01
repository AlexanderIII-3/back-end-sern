import bcrypt from 'bcryptjs';
import db from "../models";

const salt = bcrypt.genSaltSync(10); // package to hash password

let createNewUser = async (data) => {

    console.log(data);
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassWordFromService = await hashUsersPassword(data.password);
            await db.User.create({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: hashPassWordFromService,
                address: data.address,
                gender: data.gender === '1' ? true : false,
                roleId: data.RoleId,
                phoneNumber: data.phoneNumber,
            })
            resolve({
                errorCode: 0,
                errorMess: 'Creat successfully =)) '
            })
        } catch (error) {
            reject({
                errorCode: "1",
                errorMess: 'This mail curent is live in data!'
            })
        }

        resolve();
    });



};
let hashUsersPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassWord = await bcrypt.hashSync(password, salt);
            resolve(hashPassWord);
        } catch (error) {
            reject(error);
        }
    })

};
let disPlayAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findAll({
                raw: true,
            });
            resolve(user);
        } catch (error) {
            reject(error);
        }
    })


};
// edit user
let findUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true,
            })
            if (!user) {
                resolve({});
            } else {
                resolve(user);
            }
        } catch (error) {
            reject(error);
        }
    });
}
let doEditUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id }

            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.email = data.email;
                user.address = data.address;
                user.phoneNumber = data.phoneNumber;
                await user.save();
                resolve()
            }
            else {
                resolve()
            }
        } catch (error) {
            reject(error)
        }
    });
};
//delete user
let deleteUserCRUD = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.destroy({
                where: {
                    id: userId,
                }
            });
            if (userId) {
                resolve("delete successfully!");
            } else {
                resolve("user not found!");
            }
        } catch (error) {
            reject(error);
        }
    });
};
module.exports = {
    createNewUser: createNewUser,
    disPlayAllUser: disPlayAllUser,
    findUserById: findUserById,
    doEditUser: doEditUser,
    deleteUserCRUD: deleteUserCRUD
}