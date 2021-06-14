var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
// Then either:
var expect = chai.expect;
// or:
var assert = chai.assert;

const Auction = artifacts.require("Auction");
const utils = require('../app/src/utils/index');
const config = require('./config/index');
const { time } = require('@openzeppelin/test-helpers');


contract("Auction Setup", accounts => {
    let auctionInstance;
    let owner;
    let beneficiary;

    beforeEach(async () => {
        auctionInstance = await Auction.deployed();
        owner = accounts[0];
        beneficiary = accounts[1];
    });

    it('should have the correct owner.', async () => {
        const contractOwner = await auctionInstance.owner();

        assert.strictEqual(contractOwner, owner, 'Owner not strictEqual to expected accounts.');
    });

    it('should have the correct beneficiary.', async () => {
        const contractBeneficiary = await auctionInstance.beneficiary();

        assert.strictEqual(contractBeneficiary, beneficiary, 'Beneficiary is not equal to expected account.');
    });

    it('should have the correct name.', async () => {
       const auctionName = await auctionInstance.auctionName();

       assert.strictEqual(auctionName, config.AUCTION_NAME, 'Auction name no strictEqual to config.AUCTION_NAME.');
    });

    it('should have the highest bid set to 0 by default.', async () => {
        const highestBid = await auctionInstance.highestBid();

        assert.strictEqual(highestBid.toNumber(), 0, 'Highest bid not strictEqual to 0 by default.')
    });

    it('should have the highest biddder address set to 0 by default.', async () => {
        const highestBidder = await auctionInstance.highestBidder();

        assert.strictEqual(highestBidder, config.NULL_ACCOUNT, 'Highest bid not strictEqual to 0 by default.')
    });

    it('should have ended strictEqual to false by default.', async () => {
        const ended = await auctionInstance.getEnded();

        assert.strictEqual(ended, false, 'Ended not strictEqual false by default.')
    });
});

contract('Auction Flow', accounts => {
    let auctionInstance;
    let beneficiary;
    let bidder1;
    let bidder2;
    let bidder3;
    let bidder4;
    let firstBidValue;
    let secondBidValue;
    let thirdBidValue;
    let firstBidTx;
    let secondBidTx;
    let underbidTx;
    let thirdBidTx;
    let underbid;
    let outDatedBidValue;
    let outDatedBidTx;

    beforeEach(async () => {
        await time.advanceBlock();
        auctionInstance = await Auction.deployed();
        beneficiary = accounts[1]
        bidder1 = accounts[2];
        bidder2 = accounts[3];
        bidder3 = accounts[4];
        bidder4 = accounts[5];

        underbid = web3.utils.toWei('0.1', 'ether');
        firstBidValue = web3.utils.toWei('1', 'ether');
        secondBidValue = web3.utils.toWei('1.1', 'ether');
        thirdBidValue = web3.utils.toWei('1.2', 'ether');
        outDatedBidValue = web3.utils.toWei('1.3', 'ether');

        firstBidTx = { from: bidder1, value: firstBidValue};

        secondBidTx = { from: bidder2, value: secondBidValue};
        underbidTx = { from: bidder2, value: underbid};

        thirdBidTx = { from: bidder3, value: thirdBidValue};

        outDatedBidTx = { form: bidder4, value: outDatedBidValue};

    });

    it("should update highestBidder " +
        "AND highest bid" +
        "AND emit HighestBidIncreased " +
        "AND update bidder account balance.", async () => {
        const receipt = await auctionInstance.bid(firstBidTx)
        const highestBidder = await auctionInstance.highestBidder();
        const highestBid = await auctionInstance.highestBid();

        assert.strictEqual(highestBidder, bidder1, 'Highest bidder should be correct account after bid().')
        assert.strictEqual(highestBid.toString(), firstBidValue, 'Highest bid should be correct.')
        assert.strictEqual(receipt.logs[0].event, config.HIGHEST_BID_INCREASED, 'Event HIGHEST_BID_INCREASED should have fired.')
    });

    it('AND update bidder account balance.');

    it('should fail if there are no pending returns for sender account.', async () => {
        await expect(auctionInstance.withdraw({ from: bidder1 }))
            .to
            .be
            .rejectedWith(config.NO_PENDING_RETURNS_ERROR, 'Should reject with NO_PENDING_RETURNS_ERROR since this bid is the first and has not been overbid.')
    });

    it('should fail if underbids AND throw HIGHER_BID_ERROR', async () => {
        await expect(auctionInstance.bid(underbidTx))
            .to
            .be
            .rejectedWith(config.HIGHER_BID_ERROR, 'Should have rejected with HIGHER_BID_ERROR.')
    });

    it('should not be rejected when over bid AND udpate bidder balance', async () => {
        const receipt = await auctionInstance.bid(secondBidTx)
        const highestBidder = await auctionInstance.highestBidder();
        const highestBid = await auctionInstance.highestBid();

        assert.strictEqual(highestBidder, bidder2, 'Highest bidder should be correct account after bid().')
        assert.strictEqual(highestBid.toString(), secondBidValue, 'Highest bid should be correct.')
        assert.strictEqual(receipt.logs[0].event, config.HIGHEST_BID_INCREASED, 'Event HIGHEST_BID_INCREASED should have fired.')
    });

    it('should withdraw successfully after overbid AND udpate sender balance AND throw NO_PENDING_RETURNS_ERROR if withdraws again', async () => {
        await auctionInstance.bid(thirdBidTx)

        const withdrawReceipt = await auctionInstance.withdraw({ from: secondBidTx.from })
        const { event, bidder, amount } = utils.getEventData(withdrawReceipt);

        assert.strictEqual(event, config.PENDING_RETURN_WITHDRAWN, 'PENDING_RETURN_WITHDRAWN should have fired.')
        assert.strictEqual(bidder, bidder2, 'PENDING_RETURN_WITHDRAWN should have correct bidder in args.')
        assert.strictEqual(amount, secondBidValue, 'PENDING_RETURN_WITHDRAWN should have correct amount in args.')

        await expect(auctionInstance.withdraw({ from: secondBidTx.from }))
            .to
            .be
            .rejectedWith(config.NO_PENDING_RETURNS_ERROR, 'Should have rejected with HIGHER_BID_ERROR.')
    });

    it('should fail end auction if sender != owner AND throw AUCTION_END_403 error.', async () => {
        await expect(auctionInstance.auctionEnd({ from: bidder2 }))
            .to
            .be
            .rejectedWith(config.AUCTION_END_403, 'Should have rejected with HIGHER_BID_ERROR.')
    });

    it('should fail end auction if not ended yet AND throw NOT_ENDED_ERROR error.', async () => {
        await expect(auctionInstance.auctionEnd({ from: accounts[0] }))
            .to
            .be
            .rejectedWith(config.NOT_ENDED_ERROR, 'Should have rejected with NOT_ENDED_ERROR.');
    });

    it('should end auction on date AND emit AUCTION_ENDED AND transfer highestBid to beneficiary AND bid should be rejected with AUCTION_END_DATE_PASSED_ERROR if date passed', async () => {
        const auctionEndTime = await auctionInstance.auctionEndTime();

        await time.increase(time.duration.seconds((auctionEndTime.toNumber() + 86400) / 1000))

        await expect(auctionInstance.bid(outDatedBidTx))
            .to
            .be
            .rejectedWith(config.AUCTION_END_DATE_PASSED_ERROR, 'Should have rejected with AUCTION_END_DATE_PASSED_ERROR.')

        const receipt = await auctionInstance.auctionEnd({ from: accounts[0] });
        const { event, bidder, amount } = utils.getEventData(receipt);

        assert.strictEqual(event, config.AUCTION_ENDED, 'Event AUCTION_ENDED should have fired.')
        assert.strictEqual(bidder, bidder3, 'AUCTION_ENDED should have correct bidder in args.')
        assert.strictEqual(amount, thirdBidValue, 'AUCTION_ENDED should have correct amount in args.')
    });

    it('should transfer highestBid to beneficiary', async () => {
        const benefBalance = await web3.eth.getBalance(beneficiary);
        const benefEthBal = await web3.utils.fromWei(benefBalance, 'ether')

        assert.strictEqual(benefEthBal, '101.2', 'Beneficiary balance should be 101.2 ETH.')
    });
});
