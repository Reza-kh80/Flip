import React from 'react';

// import components
import Login from "@/components/LoginProcess/Login";
import { CreateAlertFunction } from "@/types/common";

interface ComponentProps {
    createAlert: CreateAlertFunction;
}

const login = ({ createAlert }: ComponentProps) => {
    return (
        <div>
            <Login createAlert={createAlert} />
        </div>
    )
}

export default login;