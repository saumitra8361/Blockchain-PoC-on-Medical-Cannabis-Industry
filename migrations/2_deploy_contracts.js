const UserDemographicData = artifacts.require("./UserDemographicData.sol");

module.exports = function(deployer) {
  deployer.deploy(UserDemographicData);
};
