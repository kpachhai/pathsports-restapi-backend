export interface CRUD {
    list: (limit: number, page: number) => Promise<any>;
    create: (resource: any) => Promise<any>;
    updateById: (id: string, resource: any) => Promise<string>;
    readById: (id: string) => Promise<any>;
    deleteById: (id: string) => Promise<string>;
    patchById: (id: string, resource: any) => Promise<string>;
}

export interface CRUDwithDid {
    list: (limit: number, page: number) => Promise<any>;
    create: (resource: any) => Promise<any>;
    updateByDid: (did: string, resource: any) => Promise<string>;
    readByDid: (did: string) => Promise<any>;
    deleteByDid: (did: string) => Promise<string>;
    patchByDid: (did: string, resource: any) => Promise<string>;
}
