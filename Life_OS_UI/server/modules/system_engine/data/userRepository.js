import prisma from '../../../shared/db.js';

export const getUserById = async (id) => {
    return await prisma.user.findUnique({
        where: { id },
    });
};

export const updateUserPreferences = async (id, { installedTools, dashboardLayout }) => {
    const data = {};
    if (installedTools) data.installedTools = JSON.stringify(installedTools);
    if (dashboardLayout) data.dashboardLayout = JSON.stringify(dashboardLayout);

    return await prisma.user.update({
        where: { id },
        data,
    });
};

export const acceptTerms = async (id) => {
    return await prisma.user.update({
        where: { id },
        data: { termsAcceptedAt: new Date() },
    });
};

export const deleteUser = async (id) => {
    return await prisma.user.delete({
        where: { id },
    });
};
