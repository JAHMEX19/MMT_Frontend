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