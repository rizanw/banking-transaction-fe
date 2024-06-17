import HomeIcon from '@mui/icons-material/Home';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import {uniqueId} from "lodash";

const Menuitems = [
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
        title: "Typography",
        icon: NoteAddIcon,
        href: "/transaction/create",
    },
    {
        id: uniqueId(),
        title: "Shadow",
        icon: LibraryBooksIcon,
        href: "/transactions",
    },
];

export default Menuitems;