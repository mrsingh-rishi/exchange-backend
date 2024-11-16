// Importing axios for making HTTP requests
const axios = require('axios');

// Defining constants for the base URL and trading parameters
const BASE_URL = "http://localhost:3000"; // Base URL for the API
const TOTAL_BIDS = 15; // Total number of bids to maintain
const TOTAL_ASK = 15; // Total number of asks to maintain
const MARKET = "TATA_INR"; // The market being traded in
const USER_ID = "5"; // The user ID for the orders

// Main function that controls the order placing and cancellation logic
async function main() {
    // Calculate the price with some randomness
    const price = 1000 + Math.random() * 10; 
    console.log(`Current market price: ${price.toFixed(2)}`);

    // Fetching the open orders for the user and market
    console.log("Fetching open orders...");
    const openOrders = await axios.get(`${BASE_URL}/api/v1/order/open?userId=${USER_ID}&market=${MARKET}`);
    console.log(`Fetched ${openOrders.data.length} open orders.`);

    // Calculate the total number of bids (buy orders) in the open orders
    const totalBids = openOrders.data.filter((o) => o.side === "buy").length;
    console.log(`Total Bids: ${totalBids}`);

    // Calculate the total number of asks (sell orders) in the open orders
    const totalAsks = openOrders.data.filter((o) => o.side === "sell").length;
    console.log(`Total Asks: ${totalAsks}`);

    // Cancel bids that are more expensive than the current price
    const cancelledBids = await cancelBidsMoreThan(openOrders.data, price);
    console.log(`Cancelled ${cancelledBids} bids`);

    // Cancel asks that are cheaper than the current price
    const cancelledAsks = await cancelAsksLessThan(openOrders.data, price);
    console.log(`Cancelled ${cancelledAsks} asks`);

    // Calculate how many more bids and asks need to be added to reach the desired total
    let bidsToAdd = TOTAL_BIDS - totalBids - cancelledBids;
    let asksToAdd = TOTAL_ASK - totalAsks - cancelledAsks;
    console.log(`Bids to add: ${bidsToAdd}, Asks to add: ${asksToAdd}`);

    // While there are still bids or asks to add, place the orders
    while (bidsToAdd > 0 || asksToAdd > 0) {
        if (bidsToAdd > 0) {
            console.log("Placing a bid order...");
            await axios.post(`${BASE_URL}/api/v1/order`, {
                market: MARKET,
                price: (price - Math.random() * 1).toFixed(1).toString(),
                quantity: "1",
                side: "buy",
                userId: USER_ID
            });
            console.log("Bid placed.");
            bidsToAdd--;
        }
        if (asksToAdd > 0) {
            console.log("Placing an ask order...");
            await axios.post(`${BASE_URL}/api/v1/order`, {
                market: MARKET,
                price: (price + Math.random() * 1).toFixed(1).toString(),
                quantity: "1",
                side: "sell",
                userId: USER_ID
            });
            console.log("Ask placed.");
            asksToAdd--;
        }
    }

    // Wait for 1 second before running the main function again
    console.log("Waiting for 1 second before next iteration...");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Recursive call to continue the loop
    main();
}

// Function to cancel bids that are more expensive than the current price or with a random chance
async function cancelBidsMoreThan(openOrders, price) {
    let promises = [];
    openOrders.map(o => {
        if (o.side === "buy" && (o.price > price || Math.random() < 0.1)) {
            console.log(`Cancelling bid order ${o.orderId} with price ${o.price}`);
            promises.push(axios.delete(`${BASE_URL}/api/v1/order`, {
                data: {
                    orderId: o.orderId,
                    market: MARKET
                }
            }));
        }
    });
    await Promise.all(promises);
    console.log(`Cancelled ${promises.length} bids`);
    return promises.length;
}

// Function to cancel asks that are cheaper than the current price or with a random chance
async function cancelAsksLessThan(openOrders, price) {
    let promises = [];
    openOrders.map(o => {
        if (o.side === "sell" && (o.price < price || Math.random() < 0.5)) {
            console.log(`Cancelling ask order ${o.orderId} with price ${o.price}`);
            promises.push(axios.delete(`${BASE_URL}/api/v1/order`, {
                data: {
                    orderId: o.orderId,
                    market: MARKET
                }
            }));
        }
    });

    await Promise.all(promises);
    console.log(`Cancelled ${promises.length} asks`);
    return promises.length;
}

// Start the process by calling main
main();
