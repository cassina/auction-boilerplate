const ExampleAuction = artifacts.require("ExampleAuction");

const { time } = require('@openzeppelin/test-helpers');
const moment = require('moment')

const config = require('./config/index');
const utils = require('web3-utils')
const { AUCTION_NAME, AUCTION_ENDS_IND, AUCTION_START_TIME } = config;

contract("ExampleAuction", accounts => {
    let exampleAuctionInstance;
    var accounts;

    beforeEach(async () => {
        await web3.eth.getAccounts(function(err,res) { accounts = res; });
        // await time.advanceBlock();

        exampleAuctionInstance = await ExampleAuction.deployed();
    });

    // it("Should have the correct name.", async () => {
    //     const contractCurrentTime = await exampleAuctionInstance.getCurrentTime();
    //     console.log('Current time contract ', contractCurrentTime.toNumber())
    //
    //     const latestTimestamp = await time.latest()
    //     console.log('Latest timestamp openxeppelin ', latestTimestamp.toNumber())
    //
    //     const momentLatestTimestampToDate = moment(contractCurrentTime.toNumber())
    //     console.log('momentLatestTimestampToDate ', momentLatestTimestampToDate)
    //     console.log('momentLatestTimestampToDate UNIX ', momentLatestTimestampToDate.unix())
    //     console.log('momentLatestTimestampToDate UNIX CONVERT', moment(momentLatestTimestampToDate.unix()))
    //
    //     const endDate = await exampleAuctionInstance.auctionEndTime();
    //     const startDate = await exampleAuctionInstance.auctionStartTime();
    //     console.log('END', moment(endDate.toNumber()))
    //     console.log('START', moment(startDate.toNumber()))
    //
    //     const getEndTimestamp = await exampleAuctionInstance.getEndTimestamp(2021, 6, 22);
    //
    //     console.log('getEndTimestamp', getEndTimestamp.toNumber());
    //
    //     // console.log('AUCTION_START_TIME', AUCTION_START_TIME.unix())
    //     // console.log('AUCTION_START_TIME', AUCTION_START_TIME.toDate())
    //     // console.log('AUCTION_ENDS_IND', AUCTION_ENDS_IND.unix())
    //     // console.log('AUCTION_ENDS_IND', AUCTION_ENDS_IND.toDate())
    //     // console.log('AUCTION_ENDS_IND BN seconds', AUCTION_ENDS_IND.seconds())
    //     // console.log('AUCTION_ENDS_IND BN to number', utils.toBN(AUCTION_ENDS_IND.unix()).toNumber())
    //     // const latestTimestamp = await time.latest()
    //     // const latestTimestampNum = latestTimestamp.toNumber()
    //     // console.log('The current block BN time to number', latestTimestampNum)
    //     // console.log('The current block BN time to number BN', utils.toBN(latestTimestampNum))
    //     // console.log('The current block BN time to number BN Number', utils.toBN(latestTimestampNum).toNumber())
    //     // console.log('The current block BN time to date', new Date(latestTimestampNum))
    //     // console.log('The current block BN time to moment', moment(latestTimestampNum))
    //     //
    //     // const latestBlockProm = await time.latestBlock();
    //     // const latestBlock = latestBlockProm.toNumber();
    //     // console.log('latestBlock', latestBlock)
    //     //
    //     // await time.increase((await time.latest()).add(time.duration.weeks(1)))
    //
    //     // await time.advanceBlockTo(latestBlock + 40);
    //     //
    //     // const latestBlockProm2 = await time.latestBlock();
    //     // const latestBlock2 = latestBlockProm2.toNumber();
    //     // console.log('latestBlock2', latestBlock2)
    //
    //     // const latestTimestamp2 = await time.latest()
    //     // const latestTimestampNum2 = latestTimestamp2.toNumber()
    //     // console.log('The current block BN time to number', latestTimestampNum2)
    //     // console.log('The current block BN time to moment', moment(latestTimestampNum2))
    //     // console.log('The current block BN time to moment', moment(latestTimestampNum2).unix())
    //     // console.log('The current block timestamp to date', moment(latestTimestamp).unix())
    //     // console.log('The current block timestamp to date', moment(latestTimestamp).toDate())
    //
    //
    //
    //     // const latestTimestamp2 = await time.latest()
    //     // console.log('The current block timestamp 2 to date', moment(latestTimestamp2).unix())
    //     // console.log('The current block timestamp 2 to date', moment(latestTimestamp2).toDate())
    //     // const auctionName = await exampleAuctionInstance.auctionName();
    //     // const weekAfter = await time.latest()
    //     // await time.increase(weekAfter.add(time.duration.weeks(2)));
    //     // const latestTimestamp = await time.latest()
    //     // console.log('The current date', moment(latestTimestamp).toDate())
    //     // assert.equal(auctionName, AUCTION_NAME, 'The Auction name is not correct');
    // });

    // it("Should have the correct owner.")
    // it("Should have the correct beneficiary.")
    // it("Should have the highest bid set to 0 by default.")
    // it("Should have the highest biddder address set to 0 by default.")
    // it("Should have ended equal to false by default.")
    // it("Should update highestBidder when calling bid.")
    // it("Should update highestBid when calling bid.")




    // it("Should fail when calling dib() and ended != true.")
    // it("Should fail when calling dib() and amount <= highestBid.")
    // it("Should not add highestBidder to pending returnsif highestBid is 0 .")


    // it("Should emit HighestBidIncreased when calling bid with correct args.")


    // it("Should have an auction end time greater than start time.", async () => {
    //     const startTimePromise = await exampleAuctionInstance.auctionStartTime();
    //     const endTimePromise = await exampleAuctionInstance.auctionEndTime();
    //     const startTime = startTimePromise.toNumber();
    //     const endTime = endTimePromise.toNumber();
    //
    //     assert.isAbove(endTime, startTime, 'The Auction end time should be greater than start time.');
    // });

    // it('Should have the correct end time equal to config AUCTION_ENDS_IND.', async () => {
    //     await time.increase(time.duration.years(50));
    //     const startTimePromise = await exampleAuctionInstance.auctionStartTime();
    //     const startTime = startTimePromise.toNumber();
    //     const endTimePromise = await exampleAuctionInstance.auctionEndTime();
    //     const endTime = endTimePromise.toNumber();
    //
    //     console.log('SUBS', endTime - startTime)
    //     console.log(moment(startTime))
    //     console.log(moment(endTime))
    //     console.log(new Date(startTime))
    //     console.log(new Date(endTime))
    //     const momentStart = moment(endTime);
    //     const momentEnd = moment(startTime);
    //
    //     console.log('The diff', momentStart.diff(momentEnd, 'minutes'))
    //     console.log('The diff', momentStart.diff(momentEnd, 'seconds'))
    //     console.log('The diff', momentStart.diff(momentEnd, 'hours'))
    //     console.log('The diff', momentStart.diff(momentEnd, 'days'))
    //     console.log('The diff', momentStart.diff(momentEnd, 'months'))
    //     console.log('The diff', momentStart.diff(momentEnd, 'years'))
    //
    //     console.log('Is the future?', new Date().getTime() > new Date(endTime).getTime())
    //     console.log('Accounts', accounts)
    //     console.log('COntract owner', await exampleAuctionInstance.owner())
    //
    //     assert.equal(await exampleAuctionInstance.beneficiary(), accounts[1], 'Beneficiary should be the second account in the list.')
    // });


});
