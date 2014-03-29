window.Order = Backbone.Model.extend({
  idAttribute: "_id",
  urlRoot: "/v1/orders",
});

window.OrderList = Backbone.Collection.extend({
  model: Order,
  url: "/v1/orders",
});

window.OrderListView = Backbone.View.extend({
  el: $("#order-list-view"),
  template: "#order-view-list-template",

  initialize: function() {
    _.bindAll(this, "render");
     this.collection.on("sync", this.render, this);
  },

  render: function(eventName) {
    var self = this;
    $(self.el).empty();

    _.each(this.collection.models, function(order) {
     var html = _.template($(self.template).html(), { order: order });
      $(self.el).append(html);

      new OrderLineItemEditView({ "model": order });
    });

    return this;
  }
});

