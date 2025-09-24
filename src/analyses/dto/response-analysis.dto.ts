export class ResponseAnalysisDto{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: number;
        project: {
            id: number;
            name: string;
        }
        creator: {
            id: number;
            name: string;
            email: string;
        }
}