const md5 = require("md5")
const jwt = require(`jsonwebtoken`)
const { validationResult } = require(`express-validator`)
const access = require("../access")
let userModel = require("../models/index").user 
let walletModel = require("../models/index").wallet
let canteenModel = require("../models/index").canteen

exports.getUser = (request, response) => {
    userModel.findAll()

    .then(result => {
        return response.json(result)
    })

    .catch(error => {
        return response.json({
            message: error.message
        })
    })
}

exports.findUser = async (request, response) => {
    let keyword = request.body.keyword
    let sequelize = require(`sequelize`)
    let Op = sequelize.Op 

    let data = await userModel.findAll({
        where: {
            [Op.or] : {
                user_name: { [Op.like] : `%${keyword}%` },
                username: { [Op.like] : `%${keyword}%` },
                role: { [Op.like] : `%${keyword}%`}
            }
        }
    })
    return response.json(data) 
}

exports.addUsers = (request, response) => {
    let newUsers = {
        user_name: request.body.user_name,
        address: request.body.address,
        number: request.body.number,
        role: 'Users',
        username: request.body.username,
        password: md5(request.body.password)
    }

    userModel.create(newUsers)
    .then(async (result) => {
        await walletModel.create({
            id_user: result.id_user,
            balance: 0,
            password: result.password
        })
        return response.json({
            message: `Users successfully added`,
            data: result
        })
    })
    
    .catch(error => {
        return response.json({
            message: error.message 
        })
    })
}

exports.addOwners = async (request, response) => {
    let granted = await access.admin(request);
    if (!granted.status) {
        return response.status(403).json(granted.message);
    }

    let newOwners = {
        user_name: request.body.user_name,
        address: request.body.address,
        number: request.body.number,
        role: 'Owners',
        username: request.body.username,
        password: md5(request.body.password)
    }

    let name = request.body.canteen_name

    userModel.create(newOwners)
    .then(async (result) => {
        await walletModel.create({
            id_user: result.id_user,
            balance: 0,
            password: result.password
        })

        await canteenModel.create({
            id_owner: result.id_user,
            canteen_name: name
        })

        return response.json({
            message: `Owners successfully added`,
            data: result
        })
    })

    .catch(error => {
        return response.json({
            message: error.message 
        })
    })
}

exports.updateUsers = async (request, response) => {
    let granted = await access.users(request);
    if (!granted.status) {
        return response.status(403).json(granted.message);
    }

    let id = request.params.id_user
    let dataUsers = {
        user_name: request.body.user_name,
        address: request.body.address,
        number: request.body.number,
        role: 'Users',
        username: request.body.username,
        password: md5(request.body.password)
    }

    userModel.update(dataUsers, {
        where: {
            id_user: id
        }
    })

    .then(result => {
        return response.json({
            message: `Users successfully updated`
        })
    })

    .catch(error => {
        return response.json({
            message: error.message 
        })
    })
}

exports.updateOwners = async (request, response) => {
    let granted = await access.admin(request);
    if (!granted.status) {
        return response.status(403).json(granted.message);
    }

    let id = request.params.id_user
    let dataOwners = {
        user_name: request.body.user_name,
        address: request.body.address,
        number: request.body.number,
        role: 'Owners',
        username: request.body.username,
        password: md5(request.body.password)
    }

    userModel.update(dataOwners, {
        where: {
            id_user: id
        }
    })

    .then(result => {
        return response.json({
            message: `Owners successfully updated`
        })
    })

    .catch(error => {
        return response.json({
            message: error.message 
        })
    })
}

exports.deleteUsers = async (request, response) => {
    let granted = await access.adminUsers(request);
    if (!granted.status) {
        return response.status(403).json(granted.message);
    }

    let id = request.params.id_user 

    walletModel.destroy({
        where: { id_user: id }
    })

    .then(result => {
        return userModel.destroy({
            where: { id_user: id }
        })
    })

    .then(result => {
        return response.json({
            message: `Users successfully removed`
        })
    })

    .catch(error => {
        return response.json({
            message: error.message 
        })
    })
}

exports.deleteOwners = async (request, response) => {
    let granted = await access.admin(request);
    if (!granted.status) {
        return response.status(403).json(granted.message);
    }

    let id = request.params.id_user 

    canteenModel.destroy({
            where: {
                id_owner: id
            }
        })

    .then(result => {
        return walletModel.destroy({
            where: { 
                id_user: id 
            }
        })
    })

    .then(result => {
        return userModel.destroy({
            where: { id_user: id }
        })
    })

    .then(result => {
        return response.json({
            message: `Owners successfully removed`
        })
    })

    .catch(error => {
        return response.json({
            message: error.message 
        })
    })
}

exports.authentication = async (request, response) => {
    let dataUser = {
        username: request.body.username,
        password: md5(request.body.password)
    }
    
    let result = await userModel.findOne({
        where: dataUser 
    })

    if (result) {
        let payload = JSON.stringify(result)
        let secretKey = `BCC Canteen`
        let token = jwt.sign(payload, secretKey)
        return response.json({
            logged: true,
            token: token, 
            user: result
        })
    } else {
        return response.json({
            logged: false,
            message: `Invalid username or password`
        })
    }
}

exports.logout = (request, response) => {
    return response.json({
        status: true,
        message: "Logout successful"
    })
}
