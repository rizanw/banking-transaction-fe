const amountFormatter = new Intl.NumberFormat("id-ID", {minimumFractionDigits: 2, maximumFractionDigits: 2});

export const formatAmount = (value: number | undefined | null): string =>
    value === undefined || value === null ? "-" : amountFormatter.format(value);
