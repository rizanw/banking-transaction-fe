import React from "react";
import {usePathname} from "next/navigation";
import {Box, List} from "@mui/material";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup";
import Menuitems from "./MenuItems";
import {useSession} from "next-auth/react";

const SidebarItems = ({toggleMobileSidebar}: any) => {
    const pathname = usePathname();
    const pathDirect = pathname;
    const {data: session} = useSession();
    const role = session?.user?.role;

    // hide items the user's role can't use (e.g. approvers can't create transactions)
    const items = Menuitems.filter(item => !item.roles || (role && item.roles.includes(role)));

    return (
        <Box sx={{px: 3}}>
            <List sx={{pt: 0}} className="sidebarNav" component="div">
                {items.map((item) => {
                    // {/********SubHeader**********/}
                    if (item.subheader) {
                        return <NavGroup item={item} key={item.subheader}/>;

                        // {/********If Sub Menu**********/}
                        /* eslint no-else-return: "off" */
                    } else {
                        return (
                            <NavItem
                                item={item}
                                key={item.id}
                                pathDirect={pathDirect}
                                onClick={toggleMobileSidebar}
                            />
                        );
                    }
                })}
            </List>
        </Box>
    );
};
export default SidebarItems;