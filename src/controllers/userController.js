import userService from "../service/userService";

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res.status(404).json({
            errorCode: 1,
            errorMess: 'Can not found email user',


        })
    }
    let userData = await userService.handleUserLogin(email, password);
    return res.status(200).json({
        errorCode: userData.errorCode,
        errorMess: userData.errorMess,
        user: userData.user ? userData.user : { user: 'is empty' }

    })
};
let handleGetAllUser = async (req, res) => {
    let id = req.query.id;
    if (!id) {
        return res.status(200).json({
            errorCode: 1,
            errorMess: 'Missing required parameter!',
            users: []

        })
    }
    let users = await userService.getAllUser(id);

    return res.status(200).json({
        errorCode: 0,
        errorMess: 'Ke',
        users

    })
};
let handleCreateNewUser = async (req, res) => {
    let data = req.body;
    console.log('check user from client', data)
    let user = await userService.createNewUser(data);
    console.log(user);
    return res.status(200).json({ user: user });
};
let handleDeleteUser = async (req, res) => {
    let id = req.body.id;



    if (!id) {
        return res.status(200).json({
            errorCode: 1,
            errorMess: ' Not Found user in the database!'
        });
    }
    else {
        let dUser = await userService.DeleteUser(id);
        return res.status(200).json(

            dUser
        );
    }


};

let handleEditUser = async (req, res) => {
    let data = req.body;
    console.log('check data edit from server', data);
    let editUser = await userService.editUserData(data);
    return res.status(200).json(editUser);
};
let handleGetDetailUser = async (req, res) => {
    let data = req.body.id;
    console.log(data)
    let getUser = await userService.takeDetail(data)
    return res.status(200).json(getUser);
}
let getAllCodes = async (req, res) => {
    try {
        let data = await userService.getAllCodeServices(req.query.type);
        return res.status(200).json(data)

    } catch (error) {
        console.log("Error All Code: ", error);
        return res.status(200).json({
            errorCode: -1,
            errorMess: 'Error from server!'
        })
    }
}
module.exports = {
    handleLogin: handleLogin,
    handleGetAllUser: handleGetAllUser,
    handleCreateNewUser: handleCreateNewUser,
    handleDeleteUser: handleDeleteUser,
    handleEditUser: handleEditUser,
    handleGetDetailUser: handleGetDetailUser,

    getAllCodes: getAllCodes,


}