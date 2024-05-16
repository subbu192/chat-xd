'use client';

import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

const username = 'Subbu';

interface ContextProps {
    userData: Object,
    setUserData: Dispatch<SetStateAction<Object>>,
    jwtToken: string,
    setJwtToken: Dispatch<SetStateAction<string>>
}

const GlobalContext = createContext<ContextProps>({
    userData: {},
    setUserData: (): Object => {return {}},
    jwtToken: '',
    setJwtToken: (): String => ''
});

export default function GlobalContextProvider({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const [ userData, setUserData ] = useState({});
    const [ jwtToken, setJwtToken ] = useState('');

    return (
        <GlobalContext.Provider value={{ userData, setUserData, jwtToken, setJwtToken }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext);