export type User = {
    handle:string;
    username:string;
    email:string;
    token:string;
    confirm?:boolean;
    admin?:boolean;
    _id:string;
    
    
}

export type RegisterFormData = Pick<User, 'handle' | 'username' | 'email' > & {
    password:string,
    password_confirmation:string,
}

export type LoginFormData = Pick<User, 'email'> & {
    password:string
}

export type CompanyFormData = {
    companyname:string,
    address?:string,
    owner?:string,
    canvas?:string
}

export interface IAreaCanvas {
  _id: string;
  name: string;
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
}

export interface IOperationalCanvasData {
  _id: string;
  company: string;
  zoom: number;
  position: { x: number; y: number };
  areas: IAreaCanvas[];
}


// Estructura de cada Compañía asociada al usuario
export interface ICompanySummary {
  _id: string;
  companyname: string;
  address?: string;
  canvas?: string;
  owner: string;
}

// Estructura del Usuario devuelto por tu API de Magnus (getUser)
export interface IUserResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  companies: ICompanySummary[]; // Arreglo de sus empresas creadas
}