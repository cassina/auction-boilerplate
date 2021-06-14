const NULL_ACCOUNT = '0x0000000000000000000000000000000000000000';
const AUCTION_NAME = 'The Amazing Project';
const YEAR = 2021;
const MONTH = 6;
const DAY = 25;
const HIGHER_BID_ERROR = 'Returned error: VM Exception while processing transaction: revert There already is a higher bid. -- Reason given: There already is a higher bid.'
const NOT_ENDED_ERROR = 'Returned error: VM Exception while processing transaction: revert Auction not yet ended. -- Reason given: Auction not yet ended.'
const NO_PENDING_RETURNS_ERROR = 'Returned error: VM Exception while processing transaction: revert There are no pending returns for this account. -- Reason given: There are no pending returns for this account.'
const AUCTION_END_403 = 'Returned error: VM Exception while processing transaction: revert Only the owner can call this method. -- Reason given: Only the owner can call this method.';
const AUCTION_END_DATE_PASSED_ERROR = 'Returned error: VM Exception while processing transaction: revert Auction end date already passed. -- Reason given: Auction end date already passed.';
const HIGHEST_BID_INCREASED = 'HighestBidIncreased';
const PENDING_RETURN_WITHDRAWN = 'PendingReturnWithdrawn';
const AUCTION_ENDED = 'AuctionEnded';

module.exports = {
    AUCTION_NAME,
    YEAR,
    MONTH,
    DAY,
    HIGHER_BID_ERROR,
    NOT_ENDED_ERROR,
    NULL_ACCOUNT,
    HIGHEST_BID_INCREASED,
    NO_PENDING_RETURNS_ERROR,
    PENDING_RETURN_WITHDRAWN,
    AUCTION_END_403,
    AUCTION_ENDED,
    AUCTION_END_DATE_PASSED_ERROR
}
