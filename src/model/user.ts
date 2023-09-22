


export type RolesItem= "admin" | "guest" | "registered" | "lunch lady" | "editor"; 
// This is for Runtime type checking
export const rolesList: string[] = ["admin" , "guest" , "registered" , "lunch lady" , "editor"]; 

export type User = {
  roles: RolesItem[],
  email: string,
  password: string,
  _id?: number,
  token?: string
};


const users:{[key:string]:User} = {};
const guestUser: User= {_id:0-1, email: "guest", password: "", "roles": ["guest"]};
let lastID = 0;

export const getGuestUser = (): User => { return guestUser};


export const createUser = (  email: string, password: string) => {
  // first user is always admin
  const nRoles: RolesItem[] = (lastID )? ['registered'] : ['admin'];
  const nUser:User = { _id:++lastID , email, password, "roles": nRoles, "token": ""};
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
const ul = Object.values(users).map((u) =>{return `${u.email} role(s) ${u.roles.join(", ")}`})
return ul.join("; ");
};

export const setRoles = (email: string, newRoles: RolesItem[])=> {
const vRoles: RolesItem[] = [];
newRoles.forEach((r) =>{
  const rL: string = r.toLowerCase();
  if (rolesList.includes(rL)) vRoles.push(rL as RolesItem);
  });
  if (! vRoles.includes("registered")) vRoles.push('registered');
  const user= findUser(email);
  if (user)
user.roles = vRoles;
return user;
 }; // setRoles 