


export type User = {
  email: string,
  password: string,
  id?: number,
  token?: string
};


const users:{[key:string]:any} = {};
let lastID = 0;


export const createUser = (newUser: User) => {
  const nUser:User = { id:++lastID , ... newUser , "token": ""};
  const key = nUser.email.toLowerCase();
  users[key] = nUser;
  return nUser;
};

export const findUser = (email:string ) => {
 if (! email) return ;  
let em:string  = email. toLowerCase();

if (! users[em]) return; 
  return users[em];
}


export const usersList = () => {
const ul = Object.keys(users);
return ul.join(", ");
};

