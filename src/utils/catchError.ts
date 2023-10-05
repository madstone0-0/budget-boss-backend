export const resolveError = (error: unknown) => {
    if (error instanceof Error) {
        return error;
    }

    return new Error("Unknown error");
};
