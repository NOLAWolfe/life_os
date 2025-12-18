// --- Azure DevOps (ADO) API Service ---
// This file will contain all the logic for interacting with the ADO API.
// For now, it contains placeholder functions that return mock data.

const mockUserStories = [
    {
        id: 26354,
        title: "As a user, I want to be able to log in with my email and password.",
        state: "Active",
        assignedTo: "Neauxla",
        acceptanceCriteria: "1. User can enter email and password. 2. User is redirected to dashboard on success. 3. User sees an error on failure.",
    },
    {
        id: 26355,
        title: "As a user, I want to see my account balance on the dashboard.",
        state: "Active",
        assignedTo: "Neauxla",
        acceptanceCriteria: "1. Dashboard displays current balance. 2. Balance is formatted as currency.",
    },
];

const mockBugs = [
    {
        id: 26388,
        title: "Login button does not work on Firefox.",
        state: "Active",
        severity: 2,
    },
];

/**
 * Fetches user stories assigned to the current user.
 * (Currently returns mock data)
 */
export const getMyUserStories = async () => {
    console.log("Fetching user stories (mock)");
    return Promise.resolve(mockUserStories);
};

/**
 * Fetches bugs assigned to the current user.
 * (Currently returns mock data)
 */
export const getMyBugs = async () => {
    console.log("Fetching bugs (mock)");
    return Promise.resolve(mockBugs);
};

const adoService = {
    getMyUserStories,
    getMyBugs,
};

export default adoService;
