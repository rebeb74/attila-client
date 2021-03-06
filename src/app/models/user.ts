export interface User {
    _id?: string;
    email: string;
    username: string;
    password: string;
    share?: [{
        id: string,
        email: string,
        username: string
    }];
    isShared?: [{
        id: string,
        email: string,
        username: string
    }];
    isAdmin?: false;
}
