import axios from "axios";

export async function signUp(emailPassword) {
    const { data } = await axios.post('/api/users/signup', emailPassword);
    return data;
}

export async function signIn(emailPassword) {
    const { data } = await axios.post('/api/users/login', emailPassword);
    return data;
}

export async function getCards() {
    // TODO: Pagination
    const authHeader = { headers: { 'Authorization': localStorage.getItem('userToken') } };
    const { data } = await axios.get('/api/cards', authHeader);
    return data;
}

export async function getCard(cardId) {
    const authHeader = { headers: { 'Authorization': localStorage.getItem('userToken') } };
    const { data } = await axios.get(`/api/cards/${cardId}`, authHeader);
    return data;
}

export async function addCard(cardInfo) {
    const authHeader = { headers: { 'Authorization': localStorage.getItem('userToken') } };
    const { data } = await axios.post('/api/cards', cardInfo, authHeader);
    return data;
}

export async function editCard(cardId, cardInfo) {
    const authHeader = { headers: { 'Authorization': localStorage.getItem('userToken') } };
    const { data } = await axios.put(`/api/cards/${cardId}`, cardInfo, authHeader);
    return data;
}

export async function deleteCard(cardId) {
    const authHeader = { headers: { 'Authorization': localStorage.getItem('userToken') } };
    const { data } = await axios.delete(`/api/cards/${cardId}`, authHeader);
    return data;
}