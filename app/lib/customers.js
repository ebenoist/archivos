App.Customer = Backbone.Model.extend({
  idAttribute: "_id",
  urlRoot: "/v1/customer"
});

App.CustomerList = Backbone.Collection.extend({
  model: App.Customer,
  url: "/v1/customer"
})

App.CustomerListView = Backbone.View.extend({
  el: "#customer-container",

  initialize: function() {
    _.bindAll(this, "render");
     this.collection.on("sync", this.render, this);
  },

  render: function() {
    var self = this;

    _.each(this.collection.models, function(customer) {
      var html = _.template($("#customer-list-template").html(), { customer: customer.toJSON() });
      $(self.el).append(html);
      return this;
    });
  }
});

App.CustomerEditListView = Backbone.View.extend({
  template: "#customer-view-list-template",
  el: $("#customer-list-view"),

  initialize: function() {
    _.bindAll(this, "render");
     this.collection.on("sync", this.render, this);
  },

  render: function(eventName) {
    var self = this;
    $(self.el).empty();

    _.each(this.collection.models, function(customer) {
     var html = _.template($(self.template).html(), { customer: customer });
      $(self.el).append(html);
    });

    return this;
  }
});
