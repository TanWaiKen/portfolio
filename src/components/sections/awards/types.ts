export type AwardCategory = string;

export interface Award {
    id: string;
    title: string;
    issuer: string;
    year: string;
    category: AwardCategory;
    impact: string;
    link?: string;
}
