"use client";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {ReactNode, useEffect} from "react";
import LoadingPage from "@/components/pages/LoadingPage";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({children}: ProtectedRouteProps) => {
    const {data: session, status} = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return; // Do nothing while loading
        if (!session) router.push("/login"); // Redirect if not authenticated
    }, [session, status, router]);

    if (status === "loading") {
        return <LoadingPage/>;
    }

    return <>{session && children}</>;
};

export default ProtectedRoute;
