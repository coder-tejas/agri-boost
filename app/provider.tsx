"use client"

import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

function Provider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const { user } = useUser();
    useEffect(() => {
        user && createNewUser();
    }, [user]);

    const createNewUser = async () => {
        try {
            await axios.post('/api/user');
        } catch {
            toast.error("Failed to create user profile");
        }
    }

    return (
        <div>
            <Toaster  position="top-center"/>
            {children}
        </div>
    )
}



export default Provider

