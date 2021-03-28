import ReactGA from "react-ga";

export const createEvent = (category, action) => {
    ReactGA.event({
        category: category,
        action: action,
    });
};

export const personalEvent = (action) => {
    ReactGA.event({
        category: 'Personal',
        action: action,
    });
};

export const communityEvent = (action) => {
    ReactGA.event({
        category: 'Community',
        action: action,
    });
};

export const teamEvent = (action) => {
    ReactGA.event({
        category: 'Team',
        action: action,
    });
};