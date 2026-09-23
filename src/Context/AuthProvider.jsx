import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { apiRequest } from "../lib/api";


const AuthProvider = ({children}) => {

    const [accessToken, setAccessToken] = useState(() => localStorage.getItem("access_token"));
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user")) || null;
        } catch {
            return null;
        }
    });
    const [isAuthLoading, setIsAuthLoading] = useState(() => Boolean(localStorage.getItem("access_token")));

    const logout = () => {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
    };

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            return undefined;
        }

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            if (payload.exp && payload.exp * 1000 <= Date.now()) throw new Error("expired");
        } catch {
            queueMicrotask(logout);
            return undefined;
        }

        apiRequest("/me", { token })
            .then((currentUser) => {
                setUser(currentUser);
                localStorage.setItem("user", JSON.stringify(currentUser));
            })
            .catch(() => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("user");
                setAccessToken(null);
                setUser(null);
            })
            .finally(() => setIsAuthLoading(false));

        const expireHandler = () => logout();
        window.addEventListener("auth-expired", expireHandler);
        return () => window.removeEventListener("auth-expired", expireHandler);
    }, []);

    const updateToken = (token) => {
        setAccessToken(token);
        if (token) localStorage.setItem("access_token", token);
        else localStorage.removeItem("access_token");
    };

    const updateUser = (nextUser) => {
        setUser(nextUser);
        if (nextUser) localStorage.setItem("user", JSON.stringify(nextUser));
        else localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken: updateToken, user, setUser: updateUser, logout, isAuthLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;