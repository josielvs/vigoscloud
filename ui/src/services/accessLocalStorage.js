exports.setUserLocalStorage = (data) => localStorage.setItem('user', JSON.stringify(data));

exports.getUserLocalStorage = () => JSON.parse(localStorage.getItem('user'));

exports.removeUserItem = () => localStorage.removeItem('user');

exports.getItemInInKey = (key) => JSON.parse(localStorage.getItem(key));

exports.setCartLocalStorage = (data) => localStorage.setItem('cart', JSON.stringify(data));

exports.getCartLocalStorage = () => JSON.parse(localStorage.getItem('cart'));

exports.removeItemCart = () => localStorage.removeItem('cart');
