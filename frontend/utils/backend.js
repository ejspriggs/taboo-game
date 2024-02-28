import axios from "axios";

export async function signUp(user) {
    const { data } = await axios.post('/api/users/signup', user);
    return data;
}

export async function signIn(user) {
    const { data } = await axios.post('/api/users/login', user);
    return data;
}