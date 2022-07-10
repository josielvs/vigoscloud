const isPassword = new RegExp(/^(?=.*[@!#$/\\])[@!#$&*()/\\a-zA-Z0-9]{6,30}$/);
const isText = new RegExp(/^[a-zA-Z]$/);
const isNumber = new RegExp(/^([0-9])+$/);
const isTextAndComma = new RegExp(/[,a-zA-Z]$/);
const isNumberAndComma = new RegExp(/[,0-9]$/);
const isTextAndNumbersAndTripleChar = new RegExp(/^([A-Z\+a-z\+0-9\+_,\-])+$/);

const valuesAnalyze = {
  checkPassword: (pass) => {
    return isPassword.test(pass);
  },
  checkText: (txt) => {
    return isText.test(txt);
  },
  checkNumber: (num) => {
    return isNumber.test(num);
  },
  checkTextAndComma: (char) => {
    return isTextAndComma.test(char);
  },
  isNumberAndComma: (char) => {
    return isNumberAndComma.test(char);
  },
  isTripleChar: (char) => {
    return isTextAndNumbersAndTripleChar.test(char);
  },
};

export default valuesAnalyze;
