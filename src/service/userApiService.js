const { Op } = require("sequelize");
import db from "../models"
import { authService } from "./authService"

const getSearchUser = async (reqQuery) => {
    try {
        const offset = (reqQuery.page - 1) * (+reqQuery.limit)
        const users = await db.User.findAndCountAll({
            where: {
                username: {
                    [Op.like]: '%' + reqQuery.q + '%'
                }
            },
            offset: offset,
            limit: (+reqQuery.limit),
            attributes: ['id', 'username', 'email', 'phone', 'gender'],
            include: { 
                model: db.Group, 
                attributes: ['name', 'description']
            }
        })

        if(users) {
            return {
                EM: 'get data success',
                EC: 0,
                DT: {
                    total: users.count,
                    per_page: reqQuery.limit,
                    current_page: reqQuery.page,
                    total_pages: Math.ceil(users.count / reqQuery.limit),
                    users: users.rows
                }
            }
        } else {
            return {
                EM: 'No data found',
                EC: 1,
                DT: []
            }
        }
    } catch (error) {
        console.error(error)
        return {
            EM: 'Internal server error',
            EC: -1,
            DT: []
        }
    }
}

const getUserList = async () => {
    try {
        const users = await db.User.findAll({
            attributes: ['id', 'username', 'email', 'phone', 'gender'],
            include: { 
                model: db.Group, 
                attributes: ['name', 'description']
            }
        })
        
        if(users) {
            return {
                EM: 'get data success',
                EC: 0,
                DT: users
            }
        } else {
            return {
                EM: 'No data found',
                EC: 1,
                DT: ''
            }
        }
        
    } catch (error) {
        console.error(error)
        return {
            EM: 'Internal server error',
            EC: -1
        }
    }
}

const getUserById = async (userId) => {
    try {
        const user = await db.User.findOne({
            where: { id: userId },
            attributes: ['email', 'phone','username', 'gender'],
            include: [
                {
                    model: db.Group,
                    attributes: ['name', 'description'],
                    include: {
                        model: db.Role,
                        attributes: ['url', 'description'],
                        through: {
                            attributes: []
                        }
                    }
                }
            ]
        })
        
        if(user) {
            return {
                EM: 'get data success',
                EC: 0,
                DT: user
            }
        } else {
            return {
                EM: 'No data found',
                EC: 1,
                DT: ''
            }
        }
    } catch (error) {
        console.error(error)
        return {
            EM: 'Internal server error',
            EC: -1
        }
    }
}

const getUserListWithPagination = async (page, limit) => {
    try {
        const offset = (page - 1) * limit
        const users = await db.User.findAndCountAll({
            offset: offset,
            limit: limit,
            attributes: ['id', 'username', 'email', 'phone', 'gender'],
            include: { 
                model: db.Group, 
                attributes: ['name', 'description']
            }
        })

        if(users) {
            return {
                EM: 'get data success',
                EC: 0,
                DT: {
                    total: users.count,
                    per_page: limit,
                    current_page: page,
                    total_pages: Math.ceil(users.count / limit),
                    users: users.rows
                }
            }
        }
        
    } catch (error) {
        console.error(error)
        return {
            EM: 'Internal server error',
            EC: -1
        }
    }
}

const createNewUser = async (reqBody) => {
    try {        
        const isEmailExist = await authService.checkEmailExists(reqBody.email)
        if(isEmailExist) {
            return {
                EM: 'Email is already exist',
                EC: 1,
                DT: []
            }
        }
    
        const isPhoneExist = await authService.checkPhoneExists(reqBody.phone)
        if(isPhoneExist) {
            return {
                EM: 'Phone is already exist',
                EC: 1,
                DT: []
            }
        }
    
        //Mã hoá password
        const hashedPassword = authService.hashUserPassword(reqBody.password)
    
        //Tạo mới user
        await db.User.create({
            email: reqBody.email,
            phone: reqBody.phone,
            username: reqBody.username,
            password: hashedPassword,
            address: reqBody.address,
            gender: reqBody.gender,
            groupId: reqBody.group
        })

        return {
            EM: 'User created successfully',
            EC: 0,
            DT: []
        }
    } catch (error) {
        console.error(error)
        return {
            EM: 'Internal server error',
            EC: -1,
            DT: []
        }
    }
}

const updateUser = () => {

}

const deleteUser = async (userId) => {
    try {
        const user = await db.User.findOne({
            where: { id: userId }
        })
    
        if(user) {
            await user.destroy()
    
            return {
                EM: `${user.username} deleted successfully`,
                EC: 0,
                DT: ''
            }
        } else {
            return {
                EM: 'User not found',
                EC: 1,
                DT: ''
            }
        }
    } catch (error) {
        console.error(error)
        return {
            EM: 'Internal server error',
            EC: -1,
            DT: ''
        }
    }
}



export const userApiService =  { 
    getSearchUser,
    getUserList,
    getUserById, 
    getUserListWithPagination, 
    createNewUser, 
    updateUser, 
    deleteUser 
}