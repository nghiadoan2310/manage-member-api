
import { userService } from '../service/userService'

const handleHomePage = (req, res) => {
    return res.render('home.ejs')
}

const handleUserPage = async (req, res) => {
    //Cách làm việc với ORM
    const userList = await userService.getUserList()
    res.render('user.ejs', { userList })

    //Cách query thủ công
    // userService.getUserList()
    // .then(userList => res.render('user.ejs', { userList }))
    // .catch(err => console.error(err))
}

const handleCreateUser = async (req, res) => {
    let email = req.body.email
    let password = req.body.password
    let username = req.body.username

    await userService.createNewUser(email, password, username)

    return res.redirect('/users')
}

const handleDeleteUser = async (req, res) => {
    let userId = req.params.id

    await userService.deleteUser(userId)
    return res.redirect('/users')


    // userService.deleteUser(userId)
    //    .then(() => res.redirect('/users'))
    //    .catch(err => console.error(err))
}

const handleUpdateUserPage = async (req, res) => {
    let userId = req.params.id

    const user = await userService.getUserById(userId)
    res.render('user-update.ejs', { user })

    // userService.getUserById(userId)
    // .then(user => res.render('user-update.ejs', { user }))
    // .catch(err => console.error(err))
}

const handleUpdateUser = async (req, res) => {
    let userId = req.params.id
    let email = req.body.email
    let username = req.body.username

    await userService.updateUser(userId, email, username)

    return res.redirect('/users')

    // userService.updateUser(userId, email, username)
    // .then(() => res.redirect('/users'))
    // .catch(err => console.error(err))
}

export const homeController = { 
    handleHomePage,
    handleUserPage,
    handleCreateUser,
    handleDeleteUser,
    handleUpdateUserPage,
    handleUpdateUser
} 