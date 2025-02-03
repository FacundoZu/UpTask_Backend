import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router()

router.post('/create-account',
    body('name')
        .notEmpty().withMessage('El nombre no puede estar vacio'),
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña es muy corta, minimo 8 caracteres'),
    body('password_confirmation').custom((value, { req }) => {
        if (req.body.password !== value) {
            throw new Error('Las contraseñas no son iguales')
        }
        return true
    }),
    body('email')
        .isEmail().withMessage('Email no valido'),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account',
    body('token')
        .notEmpty().withMessage('El token no puede estar vacio'),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login',
    body('email')
        .isEmail().withMessage('Email no valido'),
    body('password')
        .notEmpty().withMessage('Debe llenar el campo de contraseña'),
    handleInputErrors,
    AuthController.login
)

router.post('/request-code',
    body('email')
        .isEmail().withMessage('Email no valido'),
    handleInputErrors,
    AuthController.requestConfirmationCode
)

router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('Email no valido'),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token')
        .notEmpty().withMessage('El token no puede estar vacio'),
    handleInputErrors,
    AuthController.validateToken
)

router.post('/update-Password/:token',
    param('token').isNumeric().withMessage('Token no valido'),
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña es muy corta, minimo 8 caracteres'),
    body('password_confirmation').custom((value, { req }) => {
        if (req.body.password !== value) {
            throw new Error('Las contraseñas no son iguales')
        }
        return true
    }),
    handleInputErrors,
    AuthController.updatePasswordWithToken
)

router.get('/user',
    authenticate,
    AuthController.user
)

/** Profile */

router.put('/profile',
    authenticate,
    body('name')
        .notEmpty().withMessage('El nombre no puede estar vacio'),
    body('email')
        .isEmail().withMessage('Email no valido'),
    handleInputErrors,
    AuthController.updatePrfile
)

router.post('/update/password',
    authenticate,
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña es muy corta, minimo 8 caracteres'),
    body('password_confirmation').custom((value, { req }) => {
        if (req.body.password !== value) {
            throw new Error('Las contraseñas no son iguales')
        }
        return true
    }),
    body('current_password')
        .notEmpty().withMessage('La contraseña actual no puede estar vacia'),
    handleInputErrors,
    AuthController.updateCurrentUserPassword
)

router.post('/check-password',
    authenticate,
    body('password')
        .notEmpty().withMessage('La contraseña no puede estar vacia'),
    AuthController.checkPassword
)

export default router