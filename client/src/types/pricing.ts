export interface Plan {
    id: string;
    name: string;
    description: string;
    price: number;
    maxEmployees: number;
    maxStorage: number;
    modules: {
        crm: boolean;
        attendance: boolean;
        leaves: boolean;
        assets: boolean;
        tasks: boolean;
        reports: boolean;
    };
    isRecommended?: boolean;
}