import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PublicRoute({ children }) {

    const { token, user } = useSelector(
        (state) => state.auth
    );

    if (token && user) {

        const redirects = {
            doctor: "/doctor",
            receptionist: "/reception",
        };

        return (
            <Navigate
                to={redirects[user.role]}
                replace
            />
        );
    }

    return children;
}