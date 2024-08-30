import express from 'express'

import {homeController} from '../controller/homeController'

const router = express.Router()

const initWebRoutes = (app) => {
    router.get('/', homeController.handleHomePage)
    router.get('/users', homeController.handleUserPage)
    router.get('/update-user/:id', homeController.handleUpdateUserPage)
    router.post('/delete-user/:id', homeController.handleDeleteUser)
    router.post('/users/create-user', homeController.handleCreateUser)
    router.post('/user/update-user/:id', homeController.handleUpdateUser)

    return app.use('/', router)
}

export default initWebRoutes