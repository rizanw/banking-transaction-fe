import "next-auth";
import "next-auth/jwt";

export interface CorporateInfo {
    name: string;
    account_num: string;
}

export interface SessionUser {
    id: string;
    name: string;
    email: string;
    role: string; // "Maker" | "Approver"
    corporateInfo: CorporateInfo;
}

declare module "next-auth" {
    interface User {
        role: string;
        accessToken: string;
        corporateInfo: CorporateInfo;
    }

    interface Session {
        accessToken: string;
        user: SessionUser;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken: string;
        user: SessionUser;
    }
}
