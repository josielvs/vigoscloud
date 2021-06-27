const REGEX = /\S+@\S+\.\S+/;

const validEmail = (email) => REGEX.test(email);

export default validEmail;
