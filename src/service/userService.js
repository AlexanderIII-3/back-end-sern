import bcrypt from 'bcryptjs';

import db from "../models";
const salt = bcrypt.genSaltSync(10);
let handleUserLogin = async (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    // data u wanna result
                    attributes: ['id', 'email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: { email: email },
                    // raw: true


                });
                if (user) {
                    //compare password

                    let check = await bcrypt.compareSync(password, user.password); // false
                    if (check) {

                        userData.errorCode = 0;
                        userData.errorMess = 'Ke!'
                        // not result password 
                        delete user.password;
                        userData.user = user

                    } else {
                        userData.errorCode = 3;
                        userData.errorMess = 'Wrong password! Please try again';
                    }
                } else {
                    userData.errorCode = 2,
                        userData.errorMess = `Your's user email isns't in system. Please try other email!`;

                }

            }
            else {
                userData.errorCode = 1;
                userData.errorMess = `Your's user email isns't in system. Please try other email!`;

            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }

    });
};
let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail },


            });
            if (user) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    })
};
// api
let getAllUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    // Loai bo thuoc tinh password
                    attributes: {
                        exclude: ['password']
                    }
                });


            } if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                });
            }
            resolve(users);
        } catch (error) {
            reject(error);
        }
    })

}

let createNewUser = async (data) => {

    return new Promise(async (resolve, reject) => {

        try {

            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errorMess: 'This email currently live! Try other email',
                    errorCode: 1
                })
            } else {
                let hashPassWordFromService = await hashUsersPassword(data.password);
                await db.User.create({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: hashPassWordFromService,
                    address: data.address,
                    gender: data.gender,
                    roleId: data.roleId,
                    phoneNumber: data.phoneNumber,
                    positionId: data.positionId,
                    image: data.avatar

                })
                resolve({
                    errorCode: 0,
                    errorMess: ' O Ke!'
                })
            }


        } catch (error) {
            reject('Error: ' + error)
        }

        resolve()
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
let DeleteUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    id: data,

                }
            });
            if (!user) {
                resolve({
                    errorMess: 'Delete Failed! Because not found user information in database!',
                    errorCode: 1,
                })
            } else {
                await db.User.destroy({
                    where: {
                        id: data,
                    }
                })
                resolve({
                    errorCode: 0,
                    errorMess: 'Delete Successfully!'
                })
            }


        } catch (error) {
            reject('Error: ', error)
        }

    })
}
let editUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleId || !data.gender || !data.positionId) {
                resolve({
                    errorCode: 2,
                    errorMess: 'Missing required parameter'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false

            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.email = data.email;
                user.address = data.address;
                user.phoneNumber = data.phoneNumber;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                user.gender = data.gender;
                if (data.avatar) {
                    user.image = data.avatar;

                }
                await user.save();

                resolve(
                    {
                        errorCode: 0,
                        errorMess: 'Updata user successfully updated'
                    }
                )
            }
            else {
                resolve()
            }
        } catch (error) {
            reject(error)
        }
    })

}
let takeDetail = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errorCode: 2,
                    errorMess: 'This id is not exist!'

                })
            } else {
                let data = await db.User.findOne({
                    where: { id: userId }
                })
                if (!data) {
                    resolve({
                        errorCode: 1,
                        errorMess: 'Missing user! Not found User'
                    })

                }
                resolve(data)
            }
            resolve();

        } catch (error) {
            reject("Error: " + error)
        }
    })
}
let getAllCodeServices = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errorCode: 1,
                    errorMess: 'Missing required parameter!'
                })
            }
            else {
                let res = {};
                let allcode = await db.Allcode.findAll({

                    where: {
                        type: typeInput,
                    }
                });
                res.errorCode = 0;
                res.data = allcode;
                resolve(res);
            }

        } catch (error) {
            reject(error.message);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUser: getAllUser,
    createNewUser: createNewUser,
    DeleteUser: DeleteUser,
    editUserData: editUserData,
    takeDetail: takeDetail,
    getAllCodeServices: getAllCodeServices,

}