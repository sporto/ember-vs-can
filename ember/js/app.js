App = Ember.Application.create();

App.Router.map(function() {
	// put your routes here
	this.resource('accounts', function () {
		this.resource('account', { path: '/:account_id' }, function () {
			// this.resource('transactions', function () {
			// 	this.resource('transaction', {path: '/:transaction_id'});
			// });
		});
	});
});

App.IndexRoute = Ember.Route.extend({

});

App.AccountsController = Ember.ArrayController.extend({
	
});

App.AccountsIndexController = Ember.ArrayController.extend({
	
});

// App.AccountTransactionsController = Ember.ArrayController.extend({
	
// });

App.AccountsRoute = Ember.Route.extend({
	model: function(){
		return this.store.findAll('account');
	}
});

App.AccountsIndexRoute = Ember.Route.extend({
	model: function(){
		return this.store.findAll('account');
	}
});

// App.AccountTransactionsRoute = Ember.Route.extend({
// 	model: function () {
// 		return this.store.findAll('transaction');
// 	}
// });

// MODELS
App.ApplicationAdapter = DS.FixtureAdapter.extend();

App.Account = DS.Model.extend({
	label: DS.attr('string'),
	balance: DS.attr('number'),
	transactions: DS.hasMany('transaction', { async: true })
});

App.Transaction = DS.Model.extend({
	account: DS.belongsTo('account'),
	debit: DS.attr('number'),
	credit: DS.attr('number'),
	createdAt: DS.attr('date'),
});


App.Account.FIXTURES = [
	{
		id: 1,
    label: 'John',
    balance: 99,
    transactions: [101, 102]
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
  }
];

App.Transaction.FIXTURES = [
	{
		id: 101,
		credit: 100,
		debit: 0,
		createdAt: new Date()
	},
	{
		id: 102,
		credit: 0,
		debit: 100,
		createdAt: new Date()
	}
];