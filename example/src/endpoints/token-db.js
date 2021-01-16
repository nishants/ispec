const tokens= [];

module.exports = {
  getFor: ({user,access}) => {
    const token = `${user}-${access}-${Math.random()}`;
    tokens.push(token);
    return token;
  },
  isValid: (token) => {
    return tokens.includes(token);
  }
}