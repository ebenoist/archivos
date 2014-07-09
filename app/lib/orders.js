App.OrderCodeView = Backbone.View.extend({
  formGroup: $("#order-code-form"),
  feedBack: $("#order-code-feedback"),

  events: {
    "click": "checkOrder",
  },

  renderOrder: function(order_code) {
    var order = this.collection.findWhere({ order_code: order_code });

    if (order != null) {
      var archivoList = new App.ArchivoList({ order_code: order.get("order_code") });
      var archivoListView = new App.ArchivoListView({ collection: archivoList });
      archivoList.fetch();

      this.formGroup.toggleClass("has-success");
      this.feedBack.text("Welcome back!");
    } else {
      this.formGroup.toggleClass("has-error");
      this.feedBack.text("Sorry, that order code is not on file.");
    }
  },

  checkOrder: function(event) {
    event.preventDefault();
    this.renderOrder(document.forms.main.order_code.value);
  }
});

App.Order = Backbone.Model.extend({
  idAttribute: "_id",
  urlRoot: "/v1/orders",
});

App.OrderList = Backbone.Collection.extend({
  model: App.Order,
  url: "/v1/orders",
});

App.OrderListView = Backbone.View.extend({
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
    });

    return this;
  }
});
