window.Order = Backbone.Model.extend({
  idAttribute: "_id",
  urlRoot: "/v1/orders",
});

window.OrderList = Backbone.Collection.extend({
  model: Order,
  url: "/v1/orders",
});

