import {z} from 'zod'


export const messagesSchema=z.object({
    content:z
    .string()
    .min(1, { message: 'Content is required' })
    .max(1000, { message: 'Content must be at most 1000 characters'})
    
})