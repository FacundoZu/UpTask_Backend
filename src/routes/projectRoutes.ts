import { Router } from 'express'
import { body, param } from 'express-validator'
import { ProjectController } from '../controllers/ProjectController'
import { handleInputErrors } from '../middleware/validation'
import { TaskController } from '../controllers/TaskControlle'
import { projectExist } from '../middleware/project'
import { hasAuthorization, taskBlongsToProject, taskExist } from '../middleware/task'
import { authenticate } from '../middleware/auth'
import { TeamMemberController } from '../controllers/TeamController'
import { NoteController } from '../controllers/NoteController'

const router = Router()

router.use(authenticate)

router.post('/',
    body('projectName').notEmpty().withMessage('El Nombre del proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El Nombre del cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion del proyecto es obligatoria'),
    handleInputErrors,
    ProjectController.createProject
)
router.get('/', ProjectController.getAllProjects)

router.get('/:id',
    param('id').isMongoId().withMessage('Id no valido'),
    handleInputErrors,
    ProjectController.getProjectById
)

/** Routes for tasks */

router.param('projectId', projectExist)

router.put('/:projectId',
    param('projectId').isMongoId().withMessage('Id no valido'),
    body('projectName').notEmpty().withMessage('El Nombre del proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El Nombre del cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion del proyecto es obligatoria'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.updateProject
)

router.delete('/:projectId',
    param('projectId').isMongoId().withMessage('Id no valido'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.deleteProject
)




router.post('/:projectId/tasks',
    hasAuthorization,
    body('name').notEmpty().withMessage('El Nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks',
    TaskController.getProjectTasks
)


router.param('taskId', taskExist)
router.param('taskId', taskBlongsToProject)

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Id no valido'),
    handleInputErrors,
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('Id no valido'),
    body('name').notEmpty().withMessage('El Nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('Id no valido'),
    handleInputErrors,
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('Id no valido'),
    body('status').notEmpty().withMessage('El estado de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.updateStatus
)

/** Routes for team */

router.post('/:projectId/team/find',
    body('email')
        .isEmail().toLowerCase().withMessage('Email no valido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)

router.get('/:projectId/team',
    TeamMemberController.getProjectTeam
)

router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('id no valido'),
    TeamMemberController.addMemberById
)

router.delete('/:projectId/team/:userId',
    param('userId')
        .isMongoId().withMessage('id no valido'),
    TeamMemberController.removeMemberById
)

/** Routes for Notes */

router.post('/:projectId/task/:taskId/notes',
    body('content')
        .notEmpty().withMessage('El contenido de la nota es obligatorio'),
    handleInputErrors,
    NoteController.createNote
)

router.get('/:projectId/task/:taskId/notes',
    NoteController.getTaskNotes
)

router.delete('/:projectId/task/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('Id no valido'),
    handleInputErrors,
    NoteController.deleteNote
)


export default router