import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        email: string;
    }[]>;
    findOne(id: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        email: string;
    }>;
    create(userData: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        email: string;
    }>;
    update(id: string, userData: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        email: string;
    }>;
    remove(id: string): Promise<void>;
}
