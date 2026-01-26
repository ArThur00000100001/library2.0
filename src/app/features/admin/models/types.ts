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
