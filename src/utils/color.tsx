// generate index [0-9] based on tag
import { TagColors } from "../assets/styles/colors";

export const getTagColorIndex = (tag: string) => {
    let charCodeSum: number;
    if (tag.length > 2) {
        charCodeSum = tag.charCodeAt(0) + tag.charCodeAt(1) + tag.charCodeAt(1);
    } else if (tag.length > 1) {
        charCodeSum = tag.charCodeAt(0) + tag.charCodeAt(1);
    } else {
        charCodeSum = tag.charCodeAt(0);
    }

    let index = charCodeSum % 10;
    while (index > 9) {
        index = index % 10;
    }
    return index;
};

export const getTagTextColor = (tag: string) => TagColors[getTagColorIndex(tag)].text;

export const getTagColor = (tag: string) => TagColors[getTagColorIndex(tag)].background;
