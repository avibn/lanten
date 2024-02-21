export const formatTime = (time: string) => {
    return new Date(time).toLocaleString();
};

export const formatTimeToDateString = (time: string) => {
    return new Date(time).toLocaleDateString();
};
