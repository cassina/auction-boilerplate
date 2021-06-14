// const SimpleStorage = artifacts.require("SimpleStorage");
// const TutorialToken = artifacts.require("TutorialToken");
// const ComplexStorage = artifacts.require("ComplexStorage");
const Auction = artifacts.require("Auction");
const config = require('../test/config/index');

const { AUCTION_NAME, YEAR, MONTH, DAY } = config;

const getBeneficiary = async () => {
  const accounts = await web3.eth.getAccounts();
  return accounts[1]
}

module.exports = function(deployer) {
  deployer.deploy(
      Auction,
      getBeneficiary(),
      AUCTION_NAME,
      YEAR,
      MONTH,
      DAY
  );
  // deployer.deploy(SimpleStorage);
  // deployer.deploy(TutorialToken);
  // deployer.deploy(ComplexStorage);
};
