import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export const db = new PrismaClient({
    datasourceUrl: "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiN2U5MzE3OTEtMGYzNy00M2MzLTgwZWQtNGE4YjU2MTEyMTExIiwidGVuYW50X2lkIjoiMmJiZmE5OWZiN2JjZjU3NWVlMGZlYjY0OWVmZTllZWQwOWQ0N2UzYWVlNjkyYzJiZTlhYTMzMzA4ODNlYmQ1NCIsImludGVybmFsX3NlY3JldCI6IjM4NzQyOWNhLWJiNWEtNGZjMy04ZGU3LTE2OGE5NWZmNjI1NSJ9.fzzKPQJYxt-ZgjdZKheLnAf60b-gkvt4fslvMLtYoEw"
}).$extends(withAccelerate())