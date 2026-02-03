const deniedMessage = {
    message: "Access Denied!",
    error: null
}

const users = async (request) => {
    const role = request.dataUser.role
    console.log("Current Role:", role)

    if (role !== "Users") {
        return ({
            status: false,
            message: deniedMessage
        })
    }

    return ({
        status: true,
        message: "Granted"
    })
}

const owners = async (request) => {
    const role = request.dataUser.role
    console.log("Current Role:", role)

    if (role !== "Owners") {
        return ({
            status: false,
            message: deniedMessage
        })
    }

    return ({
        status: true,
        message: "Granted"
    })
}

const usersOwners = async (request) => {
    const role = request.dataUser.role
    console.log("Current Role:", role)

    if (role === "Users" || role === "Owners") {
        return ({
            status: true,
            message: "Granted"
        })
    }

    return ({
        status: false,
        message: deniedMessage
    })
}

const admin = async (request) => {
    const role = request.dataUser.role
    console.log("Current Role:", role)

    if (role !== "Admin") {
        return ({
            status: false,
            message: deniedMessage
        })
    }

    return ({
        status: true,
        message: "Granted"
    })
}

const adminUsers = async (request) => {
    const role = request.dataUser.role
    console.log("Current Role:", role)

    if (role === "Admin" || role === "Users") {
        return ({
            status: true,
            message: "Granted"
        })
    }

    return ({
        status: false,
        message: deniedMessage
    })
}

module.exports = {
    users,
    owners,
    usersOwners,
    admin,
    adminUsers
}
