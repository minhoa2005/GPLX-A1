import React, { createContext, useState } from 'react';

export const userContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const value = { user, setUser }

    return <userContext.Provider value={value}>{children}</userContext.Provider>
}