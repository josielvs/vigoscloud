const saveDataLocal = (data) => {
  localStorage.setItem('user', JSON.stringify({ data }));
};


export default saveDataLocal;
