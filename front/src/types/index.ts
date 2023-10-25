export const initialValues = {
    prodTitle: "",
    prodDescription: "",
    prodPrice: "",
    userName: "",
    userEmail: "",
    userCpf: "",
    userAddress: "",
}

export interface Products {
    id: number;
    prodTitle: string;
    prodDescription: string;
    prodPrice: string;

}

export interface User {
    userId: number;
    userName: string;
    userEmail: string;
    userCpf: string;
    userAddress: string;
}
