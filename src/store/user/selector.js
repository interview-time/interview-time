/**
 *
 * @param {UserProfile} profile
 * @returns {string} - user name or truncated email without '@' symbol
 */
export const selectProfileName = profile => {
    let name = profile.name;
    const emailIndex = name.indexOf("@");
    if (emailIndex !== -1) {
        name = name.substring(0, emailIndex);
    }
    return name;
};

/**
 *
 * @param profile
 * @returns {Team}
 */
export const selectActiveTeam = profile => profile.teams.find(team => team.teamId === profile.currentTeamId);
