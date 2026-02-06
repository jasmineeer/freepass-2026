const md5 = require("md5")
const jwt = require(`jsonwebtoken`)
const bcrypt = require('bcrypt')
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

exports.addUsers = async (request, response) => {
    let pass = await bcrypt.hash(request.body.password, 10)
    let newUsers = {
        user_name: request.body.user_name,
        address: request.body.address,
        number: request.body.number,
        role: 'Users',
        username: request.body.username,
        password: pass
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

    let pass = await bcrypt.hash(request.body.password, 10)

    let newOwners = {
        user_name: request.body.user_name,
        address: request.body.address,
        number: request.body.number,
        role: 'Owners',
        username: request.body.username,
        password: pass
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

    let pass = await bcrypt.hash(request.body.password, 10)

    let id = request.params.id_user
    let dataUsers = {
        user_name: request.body.user_name,
        address: request.body.address,
        number: request.body.number,
        role: 'Users',
        username: request.body.username,
        password: pass
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

    let pass = await bcrypt.hash(request.body.password, 10)

    let id = request.params.id_user
    let dataOwners = {
        user_name: request.body.user_name,
        address: request.body.address,
        number: request.body.number,
        role: 'Owners',
        username: request.body.username,
        password: pass
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
    let result = await userModel.findOne({
        where: {
            username: request.body.username 
        }
    })
    

    if (result) {
        let passValid = await bcrypt.compare(request.body.password, result.password)
        
        if(passValid) {  
            let payload = JSON.stringify(result)
            let secretKey = `BCC Canteen`
            let token = jwt.sign(payload, secretKey)
            return response.json({
                logged: true,
                token: token, 
                user: result
            })
        }
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
