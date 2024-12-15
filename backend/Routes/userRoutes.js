import * as userController from '../Controllers/userController.js'

import express from 'express'

const router = express.Router()

router.route("/").get(userController.getAllUsers)
                 .post(userController.addUser)

router.route("/:id").get(userController.getUserById)
                .delete(userController.deleteUser)
                .patch(userController.updateUser)

router.route("/register").post(userController.registerUser);
router.route("/login").post(userController.loginUser);

export default router;

