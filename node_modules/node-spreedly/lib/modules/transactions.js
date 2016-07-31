var util = require('../util'),
	CreditCard = require('../credit-card'),
	Transactions = module.exports;

/**
 * Lists all available gateway types on the Spreedly API
 *
 * @class Spreedly
 * @module Transactions
 * @param {Function} [cb] A Node.js-style callback
 * @returns {Promise} Bluebird promise that is resolved with the list of abstract gateway elements
 */
Transactions.listAvailableTransactions = function listAvailableGateways(cb) {
	return this._doRequest({
		url: 'transactions.xml',
		method: 'options'
	})
		.then(util.extractRoot())
		.nodeify(cb);
};

/**
 * Retrieves a full gateway element and details about a gateway, based on the token.
 *
 * @class Spreedly
 * @module Gateways
 * @param {String|Object} gatewayToken A gateway token, or a gateway element containing a token of the gateway
 * @param {Function} [cb] A Node.js-style callback
 * @returns {Promise} Bluebird promise that is resolved with the gateway element
 */
Transactions.showTransaction = function showTransaction(transactionToken, cb) {
	// Allow caller to pass in gateway objects
	transactionToken = transactionToken.token || transactionToken;

	return this._doRequest({
		url: 'transactions/' + transactionToken + '.xml'
	})
		.then(util.extractRoot())
		.nodeify(cb);
};
