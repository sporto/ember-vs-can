APP = {}

Mustache.registerHelper('loader', function (compute, options) {
	return "<span class='loader'><i class='fa fa-spinner fa-spin'></i></span>";
});

APP.MainControl = can.Control({
	init: function (ele, options) {
		var view = can.view('t-main', {});
		ele.append(view);
		can.route.ready();
	},

	'accounts route': 'showAccounts',

	'accounts/:id route': 'showAccount',

	showAccounts: function (data) {
		console.log('showAccounts');
		$el = $('<div>');
		$('.app-outlet', this.element).html($el);
		this.accountsControl = new APP.AccountsControl($el, {});
	},

	showAccount: function (data) {
		var id = data.id;
		var self  = this;
		this.requireAccounts(function () {
			self.accountsControl.showAccount(id);
		});
	},

	requireAccounts: function (cb) {
		if (this.accountsControl == null) {
			this.showAccounts();
		}
		cb();
	}
});

APP.AccountsControl = can.Control({
	init: function (ele, options) {
		var self = this;

		this.accounts = new APP.Account.List([]);
		this.state = new can.Map({loading: true});

		var viewArgs = {accounts: this.accounts, state: this.state};
		var view = can.view('t-accounts', viewArgs);
		ele.append(view);

		// get list of accounts
		APP.Account.findAll({}, function (accounts) {
			self.accounts.replace(accounts);
			self.state.attr('loading', false);
		});
	},

	showAccount: function (id) {
		console.log('showAccount', id);
		$el = $('<div>');
		$('.accounts-outlet', this.element).html($el);
		var accountControl = new APP.AccountControl($el, {id: id});
	}
});

APP.AccountControl = can.Control({
	init: function (ele, options) {
		var self = this;
		// console.log('AccountControl::init');
		// console.log('id', options.id);

		this.account = new APP.Account({id: +options.id});
		this.state = new can.Map({loading: true});

		var viewArgs = {account: this.account, state: this.state};
		var view = can.view('t-account', viewArgs);
		ele.append(view);

		// console.log('findOne')
		APP.Account.findOne({id: +options.id})
			.then(function (account) {
				// console.log(account);
				self.account.attr(account.attr());
				self.getAccountTransactions();
				self.state.attr('loading', false);
			});
	},

	getAccountTransactions: function () {
		var self = this;
		var accountId = this.account.attr('id');
		APP.Transaction.findAll({accountId: accountId})
			.then(function (transactions) {
				// console.log(transactions);
				self.account.attr('transactions', transactions);
			}, function (xhr) {
				console.log(xhr.responseText);
			});
	}
});

APP.Account = can.Model({
	findAll: 'GET /accounts',
	findOne: 'GET /accounts/{id}'
}, {
	init: function () {
		this.transactions = new APP.Transaction.List([]);
	}
});

APP.Transaction = can.Model({
	findAll: 'GET /accounts/{accountId}/transactions'
}, {});

var accounts = [
		{
			id: 1,
			label: 'John',
			balance: 99,
		},
		{
			id: 2,
			label: 'Kate',
			balance: 249,
		},
		{
			id: 3,
			label: 'Molly',
			balance: 499,
		},
		{
			id: 4,
	    label: 'Brent',
	    balance: 999,
	  },
	  {
	    id: 5,
	    label: 'Tommy',
	    balance: 499,
	  },
	  {
	    id: 6,
	    label: 'Beth',
	    balance: 58,
	  }
  ];

can.fixture("GET /accounts",function (){
	return accounts;
});

can.fixture('GET /accounts/{id}', function (request, response) {
	var one = _.find(accounts, function (account) {
		return account.id == request.data.id;
	});
	// console.log(one);
	return one;
});

can.fixture('GET /accounts/{accountId}/transactions', function (request, response) {
	console.log(request.data);
	var accountId = +request.data.accountId;
	return [{
		id: 100,
		credit: 100,
		debit: 0
	}, {
		id: 101,
		credit: 0,
		debit: 100
	}];
});

var app = new APP.MainControl($('body'));