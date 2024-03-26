export default function addIntervalToDate(date: Date, interval: string): Date {
    switch (interval) {
        case "DAILY":
            return new Date(date.setDate(date.getDate() + 1));
        case "WEEKLY":
            return new Date(date.setDate(date.getDate() + 7));
        case "MONTHLY":
            return new Date(date.setMonth(date.getMonth() + 1));
        case "YEARLY":
            return new Date(date.setFullYear(date.getFullYear() + 1));
        default:
            return date;
    }
}
