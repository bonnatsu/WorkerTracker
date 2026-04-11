import { checkAdmin } from "./auth";

export const useAdmin = () => {
    const withAdmin = (action) => async () => {
        const ok = await checkAdmin();
        if (!ok) return;
    };

    return { withAdmin };
};