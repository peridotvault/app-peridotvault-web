export type WalletItem = {
    name: string;
    title: string;
    logoUrl: string;
    downloadUrl: string;
    onClick: () => void;
    detected: boolean;
    disabled?: boolean;
};