export const routeHome = () => "/";

export const routeNews = () => "/news";

export const routeInterviews = () => "/interviews";

export const routeReports = () => "/reports";

export const routeCandidates = () => "/candidates";

export const routeCandidateDetails = id => {
    const url = "/candidates/details/:id";
    return id ? url.replace(":id", id) : url;
};

export const routeInterviewDetails = id => {
    const url = "/interviews/details/:id";
    return id ? url.replace(":id", id) : url;
};

export const routeInterviewAdd = () => `/interviews/add`;

export const routeInterviewAddFromTemplate = id => `/interviews/add?fromTemplate=${id}`;

export const routeInterviewAddFromLibrary = id => `/interviews/add?fromLibrary=${id}`;

export const routeInterviewReport = id => {
    const url = "/reports/:id";
    return id ? url.replace(":id", id) : url;
};

export const routeInterviewScorecard = id => {
    const url = "/interviews/scorecard/:id";
    return id ? url.replace(":id", id) : url;
};

export const routeTemplates = () => "/templates";

export const routeTemplateBlank = () => "/templates/user/blank/";

export const routeTemplateBlankFromLibrary = id => `/templates/user/blank?fromLibrary=${id}`;

export const routeTemplateBlankFromSharedTemplate = token => `/templates/user/blank?sharedTemplateToken=${token}`;

export const routeTemplateEdit = id => {
    const url = "/templates/user/edit/:id";
    return id ? url.replace(":id", id) : url;
};

export const routeTemplatePreview = id => {
    const url = "/templates/user/preview/:id";
    return id ? url.replace(":id", id) : url;
};

export const routeLibraryTemplatePreview = id => {
    const url = "/templates/library/preview/:id";
    return id ? url.replace(":id", id) : url;
};

export const routeTemplateLibrary = () => "/templates/library/";

export const routeQuestionBankCategory = id => `/question-bank/${id}`;

export const routeAccount = () => "/account";

export const routeSharedTemplate = () => "/template/shared/:token";

export const routeTeamNew = () => "/team/new/";

export const routeTeamSettings = id => {
    const url = "/team/:id/settings";
    return id ? url.replace(":id", id) : url;
};

export const routeTeamMembers = id => `/team/${id}/settings?tab=members`;

export const routeTeamJoin = () => "/team/join/:id";

export const getParameterByName = (name, url = window.location.href) => {
    name = name.replace(/[[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};
