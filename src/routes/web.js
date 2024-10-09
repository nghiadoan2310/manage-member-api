import express from "express";

import { userController } from "../controller/userController";

const router = express.Router();

const initWebRoutes = (app) => {
  router.get("/", userController.handleHomePage);
  router.get("/users", userController.handleUserPage);
  router.get("/update-user/:id", userController.handleUpdateUserPage);
  router.post("/delete-user/:id", userController.handleDeleteUser);
  router.post("/users/create-user", userController.handleCreateUser);
  router.post("/user/update-user/:id", userController.handleUpdateUser);

  return app.use("/", router);
};

export default initWebRoutes;
