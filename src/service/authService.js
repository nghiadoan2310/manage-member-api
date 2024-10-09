import bcrypt from 'bcryptjs' //thư viện mã hoá
import { Op } from 'sequelize'

import db from '../models'
import { createJWT } from '../middleware/JWTAction'

const salt = bcrypt.genSaltSync(10)

const hashUserPassword = (password) => {
    //Mã hoá password
    return bcrypt.hashSync(`${password}`, salt)
}

const checkEmailExists = async (userEmail) => {
    //Kiểm tra email đã tồn tại chưa
    const user = await db.User.findOne({
        where: {email: userEmail}
    })
    
    if(user) {
        return true
    }

    return false
}

const checkPhoneExists = async (userPhone) => {
    //Kiểm tra email đã tồn tại chưa
    const user = await db.User.findOne({
        where: {phone: userPhone}
    })
    
    if(user) {
        return true
    }

    return false
}

const checkPassword = (inputPassword, hashedPassword) => {
    //So sánh mật khẩu đầu vào với mật khẩu đã hash
    return bcrypt.compareSync(inputPassword, hashedPassword) //true or false
}

const createNewUser = async (reqBody) => {
    try {        
        const isEmailExist = await checkEmailExists(reqBody.email)
        if(isEmailExist) {
            return {
                EM: 'Email is already exist',
                EC: 1
            }
        }
    
        const isPhoneExist = await checkPhoneExists(reqBody.phoneNumber)
        if(isPhoneExist) {
            return {
                EM: 'Phone is already exist',
                EC: 1
            }
        }
    
        //Mã hoá password
        const hashedPassword = hashUserPassword(reqBody.password)
    
        //Tạo mới user
        await db.User.create({
            email: reqBody.email,
            phone: reqBody.phoneNumber,
            username: reqBody.username,
            password: hashedPassword
        })

        return {
            EM: 'User created successfully',
            EC: 0
        }
    } catch (error) {
        console.error(error)
        return {
            EM: 'Internal server error',
            EC: -1
        }
    }
}

const handleUserLogin = async (reqBody) => {
    try {
        //Lấy user theo email
        const user = await db.User.findOne({
            where: {
                [Op.or] : [
                    {email: reqBody.loginValue},
                    {phone: reqBody.loginValue}
                ]
            },
            attributes: ['id', 'email', 'phone', 'password' ,'username', 'gender'],
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
            const isCorrectPassword = checkPassword(reqBody.password, user.password)
            if(isCorrectPassword) {
                const payload = {
                    id: user.id
                }

                //Xóa password khỏi user trước khi trả về
                const userData = user.get({plain: true})               
                delete userData.password

                const token = createJWT(payload)

                return {
                    EM: 'Logged in successfully',
                    EC: 0,
                    DT: {
                        data: userData,
                        meta: {
                            token: token
                        }
                    }
                }
            }
        }
        
        //Nếu email/phone hoặc password không đúng
        return {
            EM: 'Email / phone number or password is incorrect',
            EC: 1,
            DT: {}
        }

    } catch (error) {
        console.error(error)
        return {
            EM: 'Internal server error',
            EC: -1,
            DT: {}
        }
    }
}


export const authService = {
    hashUserPassword,
    checkEmailExists,
    checkPhoneExists,
    createNewUser,
    handleUserLogin
}