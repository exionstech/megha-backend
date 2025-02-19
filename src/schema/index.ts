import { z } from 'zod';

export const authSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

export const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
})

export const hubSchema = z.object({
    id: z.string(),
    name: z.string(),
    address: z.string(),
    pincode: z.string(),
    hubAdminId: z.string(),
    kycstatus: z.boolean().optional(),
    kycdoc: z.enum(['AADHAR', 'PAN', 'VOTER_ID', 'DRIVING_LICENSE', 'PASSPORT']),
    kycdocurl: z.string().url(),
})

export const referenceSchema = z.object({
    id: z.string(),
    hubId: z.string()
})