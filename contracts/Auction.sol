pragma solidity ^0.7.0;

import { DateTime } from "@quant-finance/solidity-datetime/contracts/DateTime.sol";

contract Auction {
    using DateTime for *;

    // Constructor set variables
    string public auctionName;
    uint public auctionEndTime;

    // Variables set on instantiation
    address payable public owner;
    address payable public beneficiary;

    // Current state of the auction.
    uint public highestBid;
    address public highestBidder;
    // Set to true at the end, disallows any change.
    // By default initialized to `false`.
    bool ended;

    // Allowed withdrawals of previous bids
    mapping(address => uint) pendingReturns;

    // Events that will be emitted on changes.
    event HighestBidIncreased(address bidder, uint amount);
    event PendingReturnWithdrawn(address bidder, uint amount);
    event AuctionEnded(address bidder, uint amount);

    constructor(
        address payable _beneficiary,
        string memory _auctionName,
        uint _year,
        uint _month,
        uint _day
    ) public {
        owner = msg.sender;
        beneficiary = _beneficiary;
        auctionName = _auctionName;
        auctionEndTime = getTimestampFromDate(_year, _month, _day);
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
            ended == false,
            "Auction already ended."
        );

        // If the bid is not higher, send the
        // money back.
        require(
            msg.value > highestBid,
            "There already is a higher bid."
        );

        require(
            canEnd() == false,
            "Auction end date already passed."
        );

        if (highestBid != 0) {
            // Sending back the money by simply using
            // highestBidder.send(highestBid) is a security risk
            // because it could execute an untrusted contract.
            // It is always safer to let the recipients
            // withdraw their money themselves.
            pendingReturns[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid = msg.value;
        emit HighestBidIncreased(msg.sender, msg.value);
    }

    /// Withdraw a bid that was overbid.
    function withdraw() public returns (bool) {
        address bidder = msg.sender;
        uint amount = pendingReturns[bidder];

        require(
            amount > 0,
            "There are no pending returns for this account."
        );

        // It is important to set this to zero because the recipient
        // can call this function again as part of the receiving call
        // before `send` returns.
        pendingReturns[bidder] = 0;

        if (!msg.sender.send(amount)) {
            // No need to call throw here, just reset the amount owing
            pendingReturns[bidder] = amount;
            return false;
        }

        emit PendingReturnWithdrawn(bidder, amount);

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
        require(msg.sender == owner, "Only the owner can call this method.");
        require(canEnd() == true, "Auction not yet ended.");
        require(!ended, "Method auctionEnd has already been called.");

        // // 2. Effects
        ended = true;
        emit AuctionEnded(highestBidder, highestBid);

         // 3. Interaction
        beneficiary.transfer(highestBid);
    }

    function canEnd() internal view returns(bool) {
        return getCurrentTime() >= auctionEndTime;
    }

    function getEnded() public view returns (bool) {
        return ended;
    }

    function getCurrentTime() public view returns (uint) {
        return block.timestamp;
    }

    function getTimestampFromDate(
        uint256 year,
        uint256 month,
        uint256 day
    ) public pure returns (uint256) {
        return DateTime.timestampFromDate(year, month, day);
    }

    function getDateFromTimestamp(uint timestamp)
    public pure returns (
        uint256 year,
        uint256 month,
        uint256 day
    ) {
        return DateTime.timestampToDate(timestamp);
    }

   function addDaysToTimestamp(uint256 _timestamp, uint256 _days)
   public pure returns (uint) {
        return DateTime.addDays(_timestamp, _days);
    }
}
