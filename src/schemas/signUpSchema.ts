import {z} from 'zod'

export const usernameValidation=z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username must be at most 20 characters long')
    .regex(/^[a-zA-Z0-9]+$/, 'Username cannot contain special characters')

export const signUpSchema=z.object({
    username:usernameValidation,
    email:z.string().email('Invalid email'),
    password:z.string().min(4, {message:'Password must be at least 4 characters long'}),

})