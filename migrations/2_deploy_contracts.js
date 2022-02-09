var StudentRegister = artifacts.require("../contracts/StudentRegister.sol");

module.exports = function(deployer) {
  deployer.deploy(StudentRegister);
};
