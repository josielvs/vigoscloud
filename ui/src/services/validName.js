const regex = /^[a-záàâãéèêíïóôõöúçñ ]+$/i;
const nameLength = 12;

const validName = (name) => name && name.length >= nameLength && regex.test(name);

export default validName;
