const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    uri: 'mongodb+srv://spiol:Fu3k_0ff@cluster0-kvtno.mongodb.net/test?retryWrites=true&w=majority',
    secret: crypto,
    db: 'ProjectDB'
}