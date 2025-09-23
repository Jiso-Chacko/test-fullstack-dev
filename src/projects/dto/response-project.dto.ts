import { User, Project, Analyses } from '@prisma/client'

export class ResponseProjectDto{
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    owner: {
        id: number;
        name: string;
        email: string;
    }
    analyses?: {
        id: number;
        name: string;
        createdAt: Date;
    }[]
}