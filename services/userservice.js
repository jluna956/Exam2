import bcrypt from "bcrypt";
import { httpError } from "./httperror.js";

const saltRounds = 10;

class User{
    constructor({ id, username, passwordHash, email, role='user' }){
        this.id = id;
        this.username = username;
        this.passwordHash = passwordHash;
        this.email = email;
        this.role = role;
    }
}


// seed accounts: passwords are hashed with bcrypt when the server starts
const users = [
    new User({ id: 1, username: 'admin', email: 'admin@example.com', passwordHash: bcrypt.hashSync('admin1234', saltRounds), role: 'admin' }),
    new User({ id: 2, username: 'demo', email: 'demo@example.com', passwordHash: bcrypt.hashSync('demo1234', saltRounds) }),
];
let nextUserId = users.length + 1;

// strips the password hash so it never reaches a view or the session
function toPublic(user){
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
    };

}

// business rules for registering a new user
export async function registerUser({ username, password, email } = {}){
    const name = (username || '').trim();
    const emailAddress = (email || '').trim().toLowerCase();

    // rule 1: every field is required
    if(!name || !emailAddress || !password){
        throw httpError(400, "Please fill in every field.");
    }
    // rule 2: passwords need at least 8 characters
    if(password.length < 8){
        throw httpError(400, "Password must be at least 8 characters.");
    }
    // rule 3: one account per email
    if(users.some(u => u.email === emailAddress)){
        throw httpError(409, "An account with that email already exists.");
    }

    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({ id: nextUserId++, username: name, passwordHash, email: emailAddress });
    users.push(user);
    return toPublic(user);
}

// business rules for logging in: the form sends email and password
export async function loginUser({ email, password } = {}){
    const emailAddress = (email || '').trim().toLowerCase();
    const user = users.find(u => u.email === emailAddress);

    // same message for both failures, so attackers can't tell which emails exist
    if(!user || !password){
        throw httpError(401, "Invalid email or password.");
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if(!match){
        throw httpError(401, "Invalid email or password.");
    }
    return toPublic(user);
}

export function getAllUsers(){
    return users.map(toPublic);
}

export function getUserById(id){
    const user = users.find(u => u.id === Number(id));
    if(!user){
        throw httpError(404, "User not found.");
    }
    return toPublic(user);
}
