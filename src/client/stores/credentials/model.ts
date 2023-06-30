export interface GigCredential {
    userKey: string;
    secret: string;
    dc: 'us1' | 'eu2' | 'cn1' | 'il3' | null;
}