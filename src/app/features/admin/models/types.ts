type IUser = {
    id: number;
    fullName: string | null;
    firstLastName: string | null;
    secondLastName: string | null;
    email: string | null;
    dni: string | null;
    password?: string | null | undefined;
    joinDate: string | null;
    role: "admin" | "student" | null;
}