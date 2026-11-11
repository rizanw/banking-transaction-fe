// Role names as returned by the API's login response.
export const ROLE_MAKER = "Maker";
export const ROLE_APPROVER = "Approver";

// Transaction status values used by the API.
export const STATUS_AWAITING_APPROVAL = "Awaiting Approval";

export const STATUS_OPTIONS = [
    {value: 1, label: "Awaiting Approval"},
    {value: 2, label: "Approved"},
    {value: 3, label: "Rejected"},
];
