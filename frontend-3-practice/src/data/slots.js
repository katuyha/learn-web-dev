// Массивы слотов времени для четных и нечетных дней

export const SLOTS_EVEN_DAY = [
    { time: "10:00", available: true },
    { time: "11:30", available: true },
    { time: "12:00", available: false },
    { time: "13:00", available: true },
    { time: "14:30", available: true },
    { time: "16:00", available: false },
    { time: "17:30", available: true },
    { time: "19:00", available: true }
];

export const SLOTS_ODD_DAY = [
    { time: "10:00", available: true },
    { time: "11:30", available: false },
    { time: "12:00", available: true },
    { time: "13:00", available: true },
    { time: "14:30", available: false },
    { time: "16:00", available: true },
    { time: "17:30", available: true },
    { time: "19:00", available: true }
];