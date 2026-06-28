export type User = {
    handle:string;
    username:string;
    email:string;
    password:string;
    token:string;
    confirm?:boolean;
    admin?:boolean;
    _id:string;
    descripcion?:string;
    image?:string;
}

export type RegisterFormData = Pick<User, 'handle' | 'username' | 'email' > & {
    password:string,
    password_confirmation:string,
}

export type LoginFormData = Pick<User, 'email'> & {
    password:string
}