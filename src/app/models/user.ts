export interface User {
    isLoggedIn?: boolean;
    email: string;
    username: string;
    password: string;
    share?: string[];
    isAdmin?: false;
}
