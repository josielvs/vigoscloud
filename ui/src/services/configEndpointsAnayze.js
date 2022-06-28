export const toggleIsChangeFormElements = (inputName, classState) => {
  const showMenu = document.querySelector(`[name="${inputName}"]`);
  if(showMenu) {
    showMenu.classList = `${classState}`;
    return true;
  }
  return false;
};

const validCharactersPassword = new RegExp(/^(?=.*[@!#$/\\])[@!#$%^&*()/\\a-zA-Z0-9]{6,30}$/);
const validCharactersTextAndNumbers = new RegExp(/[,a-zA-Z0-9]$/);

export const charactersAnalyze = (data) => {
  const dataProperties = Object.keys(data);

  const analyzeDatas = dataProperties.map((p) => {
    if(p === 'first' || p === 'qtt' || p === 'state') {
      const checkValueIsNumber = isNaN(data[p]) || data[p] <= 0 ? false : true;
      if(!checkValueIsNumber || data[p] === '') {
        toggleIsChangeFormElements(`${p}-invalid-data`, 'has-text-danger is-size-7 is-active');
        return false;
      }
      toggleIsChangeFormElements(`${p}-invalid-data`, 'has-text-danger is-size-7 is-hidden');
      return true;
    } else if (p === 'password') {
      const checkValueIsPassword = validCharactersPassword.test(data[p]);
      if(!checkValueIsPassword) {
        toggleIsChangeFormElements(`${p}-invalid-data`, 'has-text-danger is-size-7 is-active');
        return false;
      };
      toggleIsChangeFormElements(`${p}-invalid-data`, 'has-text-danger is-size-7 is-hidden');
      return true;
    } else {
      const checkValueIsValid = validCharactersTextAndNumbers.test(data[p]);
      if(!checkValueIsValid || data[p] === '') {
        toggleIsChangeFormElements(`${p}-invalid-data`, 'has-text-danger is-size-7 is-active');
        // console.log(toggleIsChangeFormElements(`${p}-invalid-data`, 'has-text-danger is-size-7 is-active'));
        return false;
      };
      toggleIsChangeFormElements(`${p}-invalid-data`, 'has-text-danger is-size-7 is-hidden');
      return true;
    }
  });

  return analyzeDatas
};

