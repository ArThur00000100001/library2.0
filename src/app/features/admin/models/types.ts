export type IUser = {
    id: number;
    fullName: string | null;
    firstLastName: string | null;
    secondLastName: string | null;
    email: string | null;
    dni: string | null;
    password?: string | null | undefined;
    joinDate: string | null;
    role: 'admin' | 'student' | null;
};

export type IBookTitle = {
    id: number;
    title: string | null;
    author: string | null;
    publicationYear: number | null;
    isbn: string | null;
    copies?: IBook[];
};

export type IBook = {
    id: number;
    titleId: number;
    copyNumber: number;
    isAvailable: boolean;
    imgUrl: string | null;
    bookTitle?: IBookTitle;
};

//   Type posibles de un préstamo o reserva
export enum LoanState {
    RESERVATED = 1, // Reservado por el estudiante
    LOANED = 2, // Entregado físicamente (Préstamo activo)
    RETURNED = 3, // Devuelto a la biblioteca
}

//   Type que representa el registro de un préstamo o reserva
export type ILoan = {
    id: number;
    bookId: number;
    userId: number;
    loanDate: string;
    returnDate: string;
    dueDate: string;
    state: LoanState;
    book?: IBook;
    user?: IUser;
};
