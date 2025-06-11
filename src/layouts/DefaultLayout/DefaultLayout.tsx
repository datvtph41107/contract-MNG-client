import React from "react";

const DefaultLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div>
            <h1>{children}</h1>
        </div>
    );
};

export default DefaultLayout;
