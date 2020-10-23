export interface List {
    _id?: string;
    listName: string;
    userId?: string;
    list?: [{
        value: string,
        checked?: boolean,
        createdOn?: Date,
        _id?: string
    }];
    createdOn?: Date;
}
