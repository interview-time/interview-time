const KEY_NOTES_EXPANDED = "sticky-notes-enabled-v1";
const KEY_JOIN_TEAM = "selected-team-v1";

const getData = (key: string): any | undefined => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : undefined;
};

export const setData = (key: string, value: any | undefined) => {
    if (value) {
        localStorage.setItem(key, JSON.stringify(value));
    } else {
        localStorage.removeItem(key);
    }
};

export const isNotesExpanded = () => {
    const value = localStorage.getItem(KEY_NOTES_EXPANDED);
    return value === "true";
};

export const setNotesExpanded = (enabled: boolean) => {
    localStorage.setItem(KEY_NOTES_EXPANDED, enabled.toString());
};

type JoinTeam = {
    token: string;
    role: string;
};

export const setJoinTeam = (team: JoinTeam | undefined) => setData(KEY_JOIN_TEAM, team);

export const getJoinTeam = (): JoinTeam | undefined => getData(KEY_JOIN_TEAM);
