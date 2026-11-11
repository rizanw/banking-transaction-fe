import HomeIcon from '@mui/icons-material/Home';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import {uniqueId} from "lodash";
import {ROLE_MAKER} from "@/utils/roles";

interface MenuItem {
    navlabel?: boolean;
    subheader?: string;
    id?: string;
    title?: string;
    icon?: any;
    href?: string;
    roles?: string[]; // only shown to these roles; all roles when unset
}

const Menuitems: MenuItem[] = [
    {
        navlabel: true,
        subheader: "Home",
    },

    {
        id: uniqueId(),
        title: "Dashboard",
        icon: HomeIcon,
        href: "/",
    },
    {
        navlabel: true,
        subheader: "Transaction",
    },
    {
        id: uniqueId(),
        title: "Create Transaction",
        icon: NoteAddIcon,
        href: "/transaction/create",
        roles: [ROLE_MAKER],
    },
    {
        id: uniqueId(),
        title: "Transaction List",
        icon: LibraryBooksIcon,
        href: "/transactions",
    },
];

export default Menuitems;