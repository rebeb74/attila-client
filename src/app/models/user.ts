export interface User {
    _id?: string;
    isLoggedIn?: boolean;
    email: string;
    username: string;
    password: string;
    share?: string[];
    isAdmin?: false;
}
