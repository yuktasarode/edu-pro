var StudentRegister = artifacts.require("../contracts/StudentRegister.sol");
var edToken = artifacts.require("../contracts/edToken.sol");

module.exports = function(deployer) {
  deployer.deploy(StudentRegister);
  deployer.deploy(edToken,"ExcelEDToken","Exc",10000,100);

};
