//// SPDX-License-Identifier: MIT
//pragma solidity >=0.4.22 <0.9.0;
//
//import "./ExampleAuction.sol";
//
//contract MockExampleAuction is ExampleAuction {
//  uint public fakeBlockTimestamp;
//
//  constructor(
//    string memory _auctionName,
//    uint _auctionEndTime) ExampleAuction(_auctionName, _auctionEndTime) public {}
//
//  function getCurrentTime() public view returns (uint) {
//    return fakeBlockTimestamp;
//  }
//
//  function __mock__setFakeBlockTimeStamp(uint value) public {
//    fakeBlockTimestamp = value;
//  }
//}
