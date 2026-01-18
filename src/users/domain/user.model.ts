export class User {
    id: number;
    name: string;
    username: string;
    email: string;
    password: string;
    country: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}
