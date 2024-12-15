import * as taskController from '../Controllers/taskController.js'

import express from 'express'

const router = express.Router()

router.route("/").get(taskController.getAllTasks)
                 .post(taskController.addTask)

router.route("/:id").get(taskController.getTaskById)
                .delete(taskController.deleteTask)
                .patch(taskController.updateTask)

export default router;

