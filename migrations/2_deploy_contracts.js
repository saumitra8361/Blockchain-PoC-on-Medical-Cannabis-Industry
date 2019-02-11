const UserDemographicData = artifacts.require("UserDemographicData");

module.exports = function(deployer) {
  deployer.deploy(UserDemographicData);
};
