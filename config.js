const webSocketsUrl = process.env.NODE_ENV === 'production' ?
    // 'wss://lti.skolkovo.ru/brand_ws/' :
    'ws://localhost:2003' :
    'ws://localhost:2003';
module.exports = {
    webSocketsUrl
};