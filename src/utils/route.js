export const routeHome = () => "/";

export const routeInterviews = () => "/interviews";

export const routeReports = () => "/reports";

export const routeCandidates = () => "/candidates";

export const routeCandidateAdd = () => "/candidate/add";

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

export const routeProfile = () => "/account/profile";

export const routeTeamProfile = () => "/account/team/profile";

export const routeTeamMembers = () => "/account/team/members";

export const routeTeamBilling = () => "/account/team/billing";

export const routeSharedTemplate = () => "/template/shared/:token";

export const routeTeamNew = (hideMenu = false) => (hideMenu ? "/team/new?hideMenu=true" : "/team/new/");

export const routeTeamJoin = () => "/team/join/:id";

export const routeSharedScorecard = () => "/public/scorecard/:token";

export const routeInterviewChallengeLiveCoding = token => {
    const url = "/public/interview/challenge/live-coding/:token";
    return token ? url.replace(":token", token) : url;
};

export const routeSubscription = () => "/subscription";

export const getParameterByName = (name, url = window.location.href) => {
    name = name.replace(/[[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

export const getHost = () => window.location.protocol.concat("//").concat(window.location.host);

export const getApiUrl = () => process.env.REACT_APP_API_URL;
