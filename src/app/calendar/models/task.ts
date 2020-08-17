export interface Task {
    _id: string;
    userId?: string;
    title: string;
    description?: string;
    startTime: Date;
    repeat: boolean;
    altern: boolean;
}
