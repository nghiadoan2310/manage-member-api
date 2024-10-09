import jwt from 'jsonwebtoken'
import "dotenv/config.js"
import { userApiService } from '../service/userApiService'

const nonSecurePaths = ['/', '/login', '/signup', '/logout', '/user/search']

const createJWT = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY)

    return token
}

const verifyJWT = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        return decoded
    } catch (error) {
        console.log(error)
        return null
    }
}

const checkUserJWT = (req, res, next) => {
    if (nonSecurePaths.includes(req.path)) {
        return next()
    }

    const cookies = req.cookies
    if (cookies && cookies.token) {
        const token = cookies.token
        const data = verifyJWT(token)
        if (data) {
            req.user = data
            req.token = token
            next()
        } else {
            return res.status(401).json({
                EM: 'Unauthorized',
                EC: -1,
                DT: '' 
            })
        }
    } else {
        return res.status(401).json({
            EM: 'Unauthorized',
            EC: -1,
            DT: ''
        })
    }
}

const checkUserPermission = async (req, res, next) => {
    if (nonSecurePaths.includes(req.path) || req.path === '/user/me') {
        return next()
    }

    if (req.user) {
        const userId = req.user.id
        const user = await userApiService.getUserById(userId)
        const currentUrl = req.path
        if (user) {
            const userData = user.DT.get({plain: true})
            const roles = userData.Group.Roles
            if (!roles || roles.length === 0) {
                return res.status(403).json({
                    EM: "you don't have permission to access this resource",
                    EC: -1,
                    DT: ''
                })
            }

            const hasPermission = roles.some(role => role.url === currentUrl)

            if (hasPermission) {
                next()
            } else {
                return res.status(403).json({
                    EM: "you don't have permission to access this resource",
                    EC: -1,
                    DT: ''
                })
            }
        } else {
            return res.status(403).json({
                EM: 'Forbidden',
                EC: -1,
                DT: ''
            })
        }

    } else {
        return res.status(401).json({
            EM: 'Unauthorized',
            EC: -1,
            DT: ''
        })
    }
}

export {
    createJWT,
    verifyJWT,
    checkUserJWT,
    checkUserPermission
}
    