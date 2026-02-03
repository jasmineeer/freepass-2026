const akses = require("../akses")
let menuModel = require("../models/index").menu 
let canteenModel = require("../models/index").canteen 

exports.addMenu = async (request, response) => {
    let granted = await akses.owners(request);
    if (!granted.status) {
        return response.status(403).json(granted.message);
    }

    let id = request.dataUser.id_user;
    let result = await canteenModel.findOne({
        where: { 
            id_owner: id 
        }
    });

    if (!result) {
        return response.status(404).json({
            message: "Canteen not available"
        });
    }

    let newMenu = {
        id_canteen: result.id_canteen,
        menu_name: request.body.menu_name,
        menu_type: request.body.menu_type,
        description: request.body.description,
        stock: request.body.stock,
        price: request.body.price,
    }

    menuModel.create(newMenu)

        .then(result => {
            return response.json({
                status: true,
                message: `Menu successfully added`,
                data: result
            })
        })

        .catch(error => {
            return response.json({
                message: error.message
            })
        })
}

exports.updateMenu = async (request, response) => {
    let granted = await akses.owners(request);
    if (!granted.status) {
        return response.status(403).json(granted.message);
    }

    let id = request.params.id_menu
    
    let dataMenu = {
        menu_name: request.body.menu_name,
        menu_type: request.body.menu_type,
        description: request.body.description,
        stock: request.body.stock,
        price: request.body.price 
    }

    menuModel.update(dataMenu, {
        where: {
            id_menu: id
        }
    })

    .then(result => {
        return response.json({
            status: true,
            message: `Menu successfully updated`
        })
    })

    .catch(error => {
        return response.json({
            message: error.message
        })
    })
}

exports.deleteMenu = async (request, response) => {
    let granted = await akses.owners(request);
    if (!granted.status) {
        return response.status(403).json(granted.message);
    }

    let id = request.params.id_menu

    menuModel.destroy({
        where: {
            id_menu: id
        }
    })

    .then(result => {
        return response.json({
            status: true,
            message: `Menu successfully removed`
        })
    })

    .catch(error => {
        return response.json({
            message: error.message
        })
    })
}
