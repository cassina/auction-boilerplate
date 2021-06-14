// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import { DateTime } from "@quant-finance/solidity-datetime/contracts/DateTime.sol";


contract ExampleAuction {
  using DateTime for *;

  // Constructor set variables
  string public auctionName;
  uint public auctionEndTime; // In days

  // Variables set on instantiation
  address payable public owner;
  address payable public beneficiary;
  uint public auctionStartTime;

  // Current state of the auction.
  uint public highestBid;
  address public highestBidder;
  // Set to true at the end, disallows any change.
  // By default initialized to `false`.
  bool ended;

  // Allowed withdrawals of previous bids
  mapping(address => uint) pendingReturns;
  mapping(address => uint) public bids;

  // Events that will be emitted on changes.
  event HighestBidIncreased(address bidder, uint amount);
  event AuctionEnded(address winner, uint amount);

  constructor(
    string memory _auctionName,
    uint _auctionEndTime,
    address payable _beneficiary
  ) public {
    owner = msg.sender;
    auctionName = _auctionName;
    beneficiary = _beneficiary;
    auctionStartTime = getCurrentTime();
    auctionEndTime = getCurrentTime() + (_auctionEndTime * 1 days);
  }

  /// Bid on the auction with the value sent
  /// together with this transaction.
  /// The value will only be refunded if the
  /// auction is not won.
  function bid() public payable {
    // No arguments are necessary, all
    // information is already part of
    // the transaction. The keyword payable
    // is required for the function to
    // be able to receive Ether.

    // Revert the call if the bidding
    // period is over.
    require(
      ended == true,
      "Auction already ended."
    );

    // If the bid is not higher, send the
    // money back.
    require(
      msg.value > highestBid,
      "There already is a higher bid."
    );

    if (highestBid != 0) {
      // Sending back the money by simply using
      // highestBidder.send(highestBid) is a security risk
      // because it could execute an untrusted contract.
      // It is always safer to let the recipients
      // withdraw their money themselves.
      pendingReturns[highestBidder] += highestBid;
      bids[highestBidder] += highestBid;
    }
    highestBidder = msg.sender;
    highestBid = msg.value;
    emit HighestBidIncreased(msg.sender, msg.value);
  }

  /// Withdraw a bid that was overbid.
  function withdraw() public returns (bool) {
    uint amount = pendingReturns[msg.sender];
    if (amount > 0) {
      // It is important to set this to zero because the recipient
      // can call this function again as part of the receiving call
      // before `send` returns.
      pendingReturns[msg.sender] = 0;

      if (!msg.sender.send(amount)) {
        // No need to call throw here, just reset the amount owing
        pendingReturns[msg.sender] = amount;
        return false;
      }
    }
    return true;
  }

  /// End the auction and send the highest bid
  /// to the beneficiary.
  function auctionEnd() public {
    // It is a good guideline to structure functions that interact
    // with other contracts (i.e. they call functions or send Ether)
    // into three phases:
    // 1. checking conditions
    // 2. performing actions (potentially changing conditions)
    // 3. interacting with other contracts
    // If these phases are mixed up, the other contract could call
    // back into the current contract and modify the state or cause
    // effects (ether payout) to be performed multiple times.
    // If functions called internally include interaction with external
    // contracts, they also have to be considered interaction with
    // external contracts.

    // 1. Conditions
    require(getCurrentTime() >= auctionEndTime, "Auction not yet ended.");
    require(!ended, "auctionEnd has already been called.");

    // // 2. Effects
    ended = true;
    emit AuctionEnded(highestBidder, highestBid);

    // // 3. Interaction
//    beneficiary.transfer(highestBid);
  }

  function getEnded() public view returns (
    uint256 year,
    uint256 month,
    uint256 day
  ) {
    return DateTime.timestampToDate(1624233600);
  }

  function getTimestampFromDate(
    uint256 year,
    uint256 month,
    uint256 day
  ) public view returns (uint256) {
    return DateTime.timestampFromDate(year, month, day);
  }

  function getCurrentTime() public view returns (uint) {
    return block.timestamp;
  }
}
