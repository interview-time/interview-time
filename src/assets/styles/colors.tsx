// Primary actions + typography
export enum Colors {
    White = "#FFFFFF",
    Primary_50 = "#F4EAFC",
    Primary_300 = "#BA80EE",
    Primary_500 = "#8C2BE3",
    Neutral_50 = "#F9FAFB",
    Neutral_100 = "#F3F4F6",
    Neutral_200 = "#E5E7EB",
    Neutral_400 = "#9CA3AF",
    Neutral_500 = "#6B7280",
    Neutral_600 = "#4B5563",
    Neutral_800 = "#1F2937",
}

// Accent indicators, e.g. score, decisions, status
export enum AccentColors {
    Purple_500 = "#7A69EE",
    Blue_500 = "#4169E1",
    Blue_Deep_500 = "#5F81FF",
    Blue_Bolt_500 = "#0BB4FE",
    Blue_Aqua_500 = "#08C7E0",
    Teal_500 = "#06A192",
    Green_100 = "#E3FAD6", // Success background
    Green_500 = "#2FA52D",
    Green_700 = "#167625", // Success text
    Green_Deep_500 = "#1CB854",
    Orange_100 = "#FFF3D5", // Warning background
    Orange_500 = "#FFA02E",
    Orange_700 = "#B75F17", // Warning text
    Orange_Deep_500 = "#FF5722",
    Red_100 = "#FEE3D4", // Danger background
    Red_500 = "#F42D2D",
    Red_700 = "#AF1631", // Danger text
    Pink_500 = "#F9316D",
    Magenta_500 = "#FE01FC",
    Grey_500 = "#757281",
    Black_500 = "#212021",
}

// Soft indicators, e.g. tags
export enum SoftColors {
    Red_50 = "#FAE3DE",
    Red_500 = "#561C18",
    Pink_50 = "#F1E1E9",
    Pink_500 = "#472536",
    Purple_50 = "#3D2551",
    Purple_500 = "#E6DEED",
    Blue_50 = "#D6E4EE",
    Blue_500 = "#1E3245",
    Green_50 = "#FAEDCC",
    Green_500 = "#23372A",
    Yellow_50 = "#FAEDCC",
    Yellow_500 = "#3D2D1E",
    Orange_50 = "#452A13",
    Orange_500 = "#F5DFCC",
    Orange_Deep_50 = "#ECE0DB",
    Orange_Deep_500 = "#402B20",
    Black_50 = "#E3E2E0",
    Black_500 = "#32302C",
    Grey_50 = "#F0EFEE",
    Grey_500 = "#32302C",
}

export const TagColors = [
    {
        text: SoftColors.Red_500,
        background: SoftColors.Red_50,
    },
    {
        text: SoftColors.Pink_500,
        background: SoftColors.Pink_50,
    },
    {
        text: SoftColors.Purple_500,
        background: SoftColors.Purple_50,
    },
    {
        text: SoftColors.Blue_500,
        background: SoftColors.Blue_50,
    },
    {
        text: SoftColors.Green_500,
        background: SoftColors.Green_50,
    },
    {
        text: SoftColors.Yellow_500,
        background: SoftColors.Yellow_50,
    },
    {
        text: SoftColors.Orange_500,
        background: SoftColors.Orange_50,
    },
    {
        text: SoftColors.Orange_Deep_500,
        background: SoftColors.Orange_Deep_50,
    },
    {
        text: SoftColors.Black_500,
        background: SoftColors.Black_50,
    },
    {
        text: SoftColors.Grey_500,
        background: SoftColors.Grey_50,
    },
];
