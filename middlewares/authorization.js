let jwt = require("jsonwebtoken")
exports.authorization = (request, response, next) => {
    let header = request.headers.authorization
    let token = header && header.split(" ")[1]

    if (token == null) {
        return response.json({
            message: `Unauthorized`
        })
    } else {
        let secretKey = `BCC Canteen`

        jwt.verify(token, secretKey, (error, user) => {
            if (error) {
                return response.json({
                    message: `Token is Invalid`
                })
            } else {
                request.dataUser = user;
                next()
            }
        })
    }
}
