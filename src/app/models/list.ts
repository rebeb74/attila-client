export interface List {
    _id?: string;
    listName: string;
    userName: string;
    userId?: string;
    public?: boolean;
    list?: [{
        _id?: string
        value: string,
        checked?: boolean,
        createdOn?: Date,
    }];
    createdOn?: Date;
}
