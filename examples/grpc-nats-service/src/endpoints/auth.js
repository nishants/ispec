const tokens = require("./token-db");

module.exports = (request, response, next) => {
  const bearerToken = request.headers.authorization?.split("Bearer ").pop();

  if(!bearerToken){
    return response.status(403).send("Expected header {Authorization: Bearer <token>}");
  }

  if(!tokens.isValid(bearerToken)){
    return response.status(403).send("Invalid token");
  }
  next();
};