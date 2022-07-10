const changeScreenView = {
  changeBorderImputToRedOrNormal: (check, element) => {
    const elementTarget = document.querySelector(`[name="${element}"]`);
    const { className } = elementTarget;
  
    const allClasses = className.split(' ');
    const classExist = allClasses.includes('is-danger');
  
    if(!check && !classExist) return elementTarget.classList = `${className} is-danger`;
    if(check && classExist) {
      const classTarget = allClasses.indexOf('is-danger');
      allClasses.splice(classTarget, 1);
      const removedClass = allClasses.toString().split(',').join(' ');
      elementTarget.classList = `${removedClass}`;
      return;
    }
    
    return;
  },
  changeVisibityMessages: (check, element) => {
    const elementTarget = document.querySelector(`[name="${element}"]`);
    const { className } = elementTarget;
  
    const allClasses = className.split(' ');
    const classExist = allClasses.includes('is-hidden');
  
    if(!check && classExist) {
      const classTarget = allClasses.indexOf('is-hidden');
      allClasses.splice(classTarget, 1);
      const removedClass = allClasses.toString().split(',').join(' ');
      elementTarget.classList = `${removedClass}`;
      return;
    }
  
    if(check && !classExist) return elementTarget.classList = `${className} is-hidden`;
  
    return;
  },
};

export default changeScreenView;
