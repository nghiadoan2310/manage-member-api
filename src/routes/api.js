import express from "express";

import { authController } from "../controller/authController";
import { userApiController } from '../controller/userApiController'
import { groupController } from "../controller/groupController";
import { checkUserJWT, checkUserPermission } from "../middleware/JWTAction";

const router = express.Router();

const initApiRoutes = (app) => {

  router.all('*', checkUserJWT, checkUserPermission)
  router.post("/signup", authController.handleSignup);
  router.post("/login", authController.handleLogin);
  router.get("/logout", authController.handleLogout);
  
  router.get("/user/search", userApiController.searchUser)
  router.get("/user/me", userApiController.getUserById);
  router.get("/user/show", userApiController.getUserList);
  router.post("/user/create", userApiController.createNewUser);
  router.put("/user/update", userApiController.updateUser);
  router.delete("/user/delete/:id", userApiController.deleteUser);

  router.get("/group/show", groupController.getGroups);

  return app.use("/api/v1", router);
};

export default initApiRoutes
