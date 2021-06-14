const convertBNDateToJsDate = (bigNumber) => {
    const year = bigNumber.year.toNumber();
    const month = bigNumber.month.toNumber() -1; // January = 0;
    const day = bigNumber.day.toNumber();

    return new Date(year, month, day);
}

const getEventData = (receipt) => {
    const { logs } = receipt;
    const { event, args } = logs[0]
    const { bidder, amount } = args;

    return Object.assign(
        {},
        { event, bidder, amount: amount.toString() }
    )
}

module.exports = {
    convertBNDateToJsDate,
    getEventData
}
