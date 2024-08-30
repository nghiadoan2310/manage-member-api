import mysql from 'mysql2' //thư viện dùng kết nối với mysql
import bcrypt from 'bcryptjs' //thư viện mã hoá

import db from '../models'

//create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'manage_member'
})

const salt = bcrypt.genSaltSync(10)

const hashUserPassword = (password) => {
    //Mã hoá password
    return bcrypt.hashSync(`${password}`, salt)
}

const createNewUser = async (email, password, username) => {
    let hashPassword = userService.hashUserPassword(password)

    try {
        await db.User.create({
            email: email,
            password: hashPassword,
            username: username
        })
    } catch (error) {
        console.error(error)
        throw new Error('Failed to create new user')
    }
}

const getUserList = async () => {
    let users = []

    users = await db.User.findAll() 
    return users
    // return new Promise((resolve, reject) =>{
    //     try{
    //         connection.query(
    //             'SELECT * FROM users',
    //             function(err, results, fields) {
    //                 if (err) {
    //                     console.error(err)
    //                     return resolve(users)
    //                 }
        
    //                 users = results
    //                 return resolve(users)
    //             }
    //         )
    //     }
    //     catch(e){
    //         reject(e)
    //     }
    // }) 
}

const deleteUser = async (userId) => {

    await db.User.destroy({
        where: {
            id: userId
        }
    })

    // return new Promise((resolve, reject) => {
    //     try{
    //         connection.query(
    //             'DELETE FROM users WHERE id =?', [id],
    //             function(err, results, fields) {
    //                 if (err) {
    //                     console.error(err)
    //                     return resolve(true)
    //                 }
        
    //                 return resolve(true)
    //             }
    //         )
    //     }
    //     catch(e){
    //         reject(e)
    //     }
    // })
}

const updateUser = async (userId, email, username) => {

    await db.User.update(
        {
            email: email,
            username: username
        },
        {
            where: {
                id: userId
            }
        }
    )

    // return new Promise((resolve, reject) => {
    //     try{
    //         connection.query(
    //             'UPDATE users SET email =?, username =? WHERE id =?', [email, username, id],
    //             function(err, results, fields) {
    //                 if (err) {
    //                     console.error(err)
    //                     return resolve(true)
    //                 }
        
    //                 return resolve(true)
    //             }
    //         )
    //     }
    //     catch(e){
    //         reject(e)
    //     }
    // })
}

const getUserById = async (userId) => {
    let user = {}

    user = await db.User.findOne({
        where: {
            id: userId
        }
    })

    return user


    // return new Promise((resolve, reject) => {
    //     try{
    //         connection.query(
    //             'SELECT * FROM users WHERE id =?', [id],
    //             function(err, results, fields) {
    //                 if (err) {
    //                     console.error(err)
    //                     return resolve(null)
    //                 }
        
    //                 return resolve(results[0])
    //             }
    //         )
    //     }
    //     catch(e){
    //         reject(e)
    //     }
    // })
}

export const userService = {
    hashUserPassword,
    createNewUser,
    getUserList,
    getUserById,
    deleteUser,
    updateUser
}