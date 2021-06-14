pragma solidity >=0.4.21 <0.7.0;

import "../contracts/ExampleAuction.sol";
import "../contracts/MockExampleAuction.sol";
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";

contract ExampleAuctionTest {
//    ExampleAuction exampleAuction = ExampleAuction(DeployedAddresses.ExampleAuction());
    uint expectedMockAuctionEndTime;

    address payable owner;
    address payable beneficiary;
    string auctionName;
    uint startingBid;
    uint auctionEndTime;
    uint futureTime;

    ExampleAuction auction_sub;
    MockExampleAuction auction_sub_mock;

    function beforeAll() public {
//        owner = 0xaee905FdD3ED851e48d22059575b9F4245A82B04;
//        beneficiary = 0xaee905FdD3ED851e48d22059575b9F4245A82B04;
        auctionName = 'The Amazing Project';
//        startingBid = 100000000000000001;
        auctionEndTime = 1;
        expectedMockAuctionEndTime = 0 + (auctionEndTime * 1 days);
        futureTime = expectedMockAuctionEndTime + 10 days;

        auction_sub = new ExampleAuction(
            auctionName,
            auctionEndTime
        );

        auction_sub_mock = new MockExampleAuction(
            auctionName,
            auctionEndTime
        );
    }

    // function checkSuccess() public {
    //     // Use 'Assert' methods: https://remix-ide.readthedocs.io/en/latest/assert_library.html
    //     Assert.ok(2 == 2, 'should be true');
    //     Assert.greaterThan(uint(2), uint(1), "2 should be greater than to 1");
    //     Assert.lesserThan(uint(2), uint(3), "2 should be lesser than to 3");
    // }

    // function checkSuccess2() public pure returns (bool) {
    //     // Use the return value (true or false) to test the contract
    //     return true;
    // }

    // function checkAuctionName() public {
    //     Assert.ok(keccak256(bytes(auction_sub.auctionName())) == keccak256(bytes(auctionName)), 'Auction name should be The Amazing Project.');
    // }

    // function checkEndTimeGreaterThanStartTime() public {
    //     Assert.ok(auction_sub.auctionEndTime() > auction_sub.auctionStartTime(), 'Start time should be greater than end time.');
    // }


    // function checkGetCurrentTimeDefault() public {
    //     Assert.ok(auction_sub_mock.getCurrentTime() == 0, 'getCurrentTime default value should be 0');
    // }

    // function check__mock__setFakeBlockTimeStampSetsInstanceVariable() public {
    //     auction_sub_mock.__mock__setFakeBlockTimeStamp(2);
    //     Assert.ok(auction_sub_mock.fakeBlockTimestamp() == 2, '__mock__setFakeBlockTimeStamp should set instance varaible');
    // }

    // function checkGetCurrentTimeShouldReturnUpdatedFakeBlockTimestamp() public {
    //     auction_sub_mock.__mock__setFakeBlockTimeStamp(2);
    //     Assert.ok(auction_sub_mock.getCurrentTime() == 2, 'getCurrentTime return value should be equal to argument');
    // }

    // function checkMockStartTime() public {
    //     Assert.ok(auction_sub_mock.auctionStartTime() == 0, 'MockExampleAuction start time should be 0');
    // }

    // function checkMockStartTimeNotChanged() public {
    //     auction_sub_mock.__mock__setFakeBlockTimeStamp(2);
    //     Assert.ok(auction_sub_mock.auctionStartTime() == 0, 'MockExampleAuction start time should not change with __mock__setFakeBlockTimeStamp.');
    // }

    // function checkMockEndTime() public {
    //     Assert.ok(auction_sub_mock.auctionEndTime() == expectedMockAuctionEndTime, 'MockExampleAuction end time should be auctionEndTime * 1 days.');
    // }

    // function checkMockEndTimeNotChanged() public {
    //     auction_sub_mock.__mock__setFakeBlockTimeStamp(2);
    //     Assert.ok(auction_sub_mock.auctionEndTime() == expectedMockAuctionEndTime, 'MockExampleAuction end time should not change with __mock__setFakeBlockTimeStamp.');
    // }

    function testAuctionEnd() public {
        auction_sub_mock.bid();

        auction_sub_mock.__mock__setFakeBlockTimeStamp(futureTime);


        auction_sub_mock.auctionEnd();

        Assert.equal(auction_sub_mock.highestBid(), 100000000000000001, 'High bid');
        Assert.equal(auction_sub_mock.getCurrentTime(), futureTime, 'Fake block timestamp should be in the future.');
        Assert.equal(auction_sub_mock.auctionEndTime(), expectedMockAuctionEndTime, 'Auction end time should be set.');
//        Assert.lessThan(auction_sub_mock.auctionEndTime(), auction_sub_mock.getCurrentTime(), 'Auction end time lesser than current time returned by mocked contract.');
        Assert.equal(auction_sub_mock.getEnded(), true, 'Auction ended should have changed to true.');
    }
}
