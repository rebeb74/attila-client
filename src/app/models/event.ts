export interface AllEvents{
    _id?: string;
    userId?: string;
    title?: string;
    description?: string;
    startTime: string;
}

export interface Event extends AllEvents{
    startHour: string;
    place?: string;
    alert?: Date;
}

export interface Task extends AllEvents{
    repeat?: string;
    altern?: string;
}

