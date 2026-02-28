// network_type: "testnet" | "mainnet" | "all";
export type SettingKey = "network" | "currency" | "selected_chain";

export type SettingRow = {
    key: SettingKey;
    value: string;
    updated_at: number;
};
