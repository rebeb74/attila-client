export interface Event {
    _id: string;
    userId?: string;
    title: string;
    description?: string;
    startTime: Date;
    startHour: string;
    place?: string;
    alert?: Date;
}
