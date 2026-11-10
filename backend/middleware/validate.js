import { body, validationResult } from "express-validator";

export const validateRegister = [
    body("correo").isEmail().withMessage("Correo inválido"),
    body("contrasena").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    body("nombre_usuario").notEmpty().withMessage("El nombre de usuario es obligatorio"),
    (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
    }
];
