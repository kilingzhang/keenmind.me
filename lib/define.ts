import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = 'edge';

// @ts-ignore
export const isEdge = runtime === 'edge';


export const getRequestEnv = (key: string) => {
    if (isEdge) {
        // @ts-ignore
        return getRequestContext().env[key];
    }
    return process.env[key];
}


export const getRequestEnvs = (): any => {
    if (isEdge) {
        return getRequestContext().env;
    }
    return process.env;
}