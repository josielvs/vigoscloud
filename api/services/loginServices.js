const tokenServices = require('./tokenServices');
const bcrypt = require('bcrypt-nodejs');

const {
  validEmail,
  validPassword,
  validName,
  status,
} = require('../helpers');

const salt = bcrypt.genSaltSync(5);

const signInLogin = async (readUsers, data) => {
  const { email, password } = data;

  validEmail(email);
  validPassword(password);

  const user = await readUsers.readByEmail(email);
  if (!user) throw status.invalidData;

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) throw status.invalidToken;
  
  delete user.password;
  const token = tokenServices.generateToken({ data: user });

  if (user.role !== 'api') return { token, user };
  return { token };
};

const signUpLogin = async (createUsers, data) => {
  const { email, password, name } = data;

  validEmail(email);
  validPassword(password);
  validName(name);

  const userAlreadyExistis = await createUsers.readByEmail(email);
  if (userAlreadyExistis) throw status.invalidData;

  const checkPassword = await bcrypt.hashSync(password, salt);
  data.password = checkPassword;
  const user = await createUsers.create(data);

  delete user.password;
  const token = tokenServices.generateToken({ data: user });
  return token;
};

// const updateUser = async (data) => {
//   const { name } = data;
//   validName(name);
//   const updatedUser = await loginModel.updateUser(data);
//   return updatedUser;
// };

module.exports = {
  signInLogin,
  signUpLogin,
  // updateUser,
};
