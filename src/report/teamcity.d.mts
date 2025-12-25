export interface IInspection {
    typeId: string;
    message: string;
    file?: string;
    SEVERITY: "ERROR" | "WARNING" | "INFO";
    flowId: string;
    timestamp: string;
}

export interface IInspectionType {
    id: string;
    name: string;
    description: string;
    category: string;
    flowId: string;
    timestamp: string;
}