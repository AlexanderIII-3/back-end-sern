import db from "../models";
import CRUDService from "../service/CRUDService";
let getHomeController = async (req, res) => {
    try {
        // Home Page
        return res.render('HomePage.ejs');
    } catch (error) {
        console.log("Error: " + error)
    }

};
// create new user
let getCRUD = (req, res) => {
    return res.render('crud.ejs');

};
// Create new user account in database
let postCRUD = async (req, res) => {

    try {
        let mess = await CRUDService.createNewUser(req.body);
        return res.redirect('/get-crud');
    } catch (error) {

    }


};
let editCRUD = (req, res) => {
    return res.send('anh ne');
};
// List users  in database
let getDisPlayCRUD = async (req, res) => {
    let data = await CRUDService.disPlayAllUser();
    // console.log("--------------------------------")
    // console.log('dislau user', data);
    // console.log("--------------------------------");
    return res.render('disPlayUser.ejs', { dataUser: data });
};
// Edit crude
let getEditCRUD = async (req, res) => {

    let userId = req.query.id;
    if (userId) {
        let takeUserById = await CRUDService.findUserById(userId);
        console.log('--------------------------------')
        console.log(takeUserById)
        console.log('--------------------------------')
        return res.render('editCrud.ejs', { user: takeUserById });
    }
    else if (!userId) {
        return res.send('User not found!');
    }


}
let postEditCRUD = async (req, res) => {
    try {
        let data = req.body;
        if (data) {
            let user = await CRUDService.doEditUser(data);
            console.log('Update successful!')
            return res.redirect('/get-crud');
        } else {
            return res.send('Can not edit user!')
        }

    } catch (error) {
        console.log(error)
    }

};
// Delete user 
let getDeleteCRUD = async (req, res) => {
    let userId = req.body.id;
    let deleteUser = await CRUDService.deleteUserCRUD(userId);
    return res.redirect('/get-crud');
};
module.exports = {
    getHomeController: getHomeController,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    editCRUD: editCRUD,
    getDisPlayCRUD: getDisPlayCRUD,
    getEditCRUD: getEditCRUD,
    postEditCRUD: postEditCRUD,
    getDeleteCRUD: getDeleteCRUD,

}
