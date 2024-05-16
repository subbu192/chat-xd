'use server';

import { cookies } from "next/headers";

export const getCookieValue = async (cookieName) => {
    const cookieStore = cookies();
    return cookieStore.get(cookieName);
}