window.OrderCodeView = Backbone.View.extend({
  formGroup: $("#order-code-form"),
  feedBack: $("#order-code-feedback"),

  events: {
    "click": "checkOrder",
  },

  renderOrder: function(order_code) {
    var order = this.collection.findWhere({ order_code: order_code });

    if (order != null) {
      var archivoList = new ArchivoList({ order_code: order.get("order_code") });
      var archivoListView = new ArchivoListView({ collection: archivoList });
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

var ArchivosRouter = Backbone.Router.extend({
  initialize: function() {
    params = getQueryParams(document.location.search);

    var orders = new OrderList();
    var orderCodeView = new OrderCodeView({ collection: orders, el: $("#checkOrder") });
    var orderCode = params.order_code;

    // HACKY
    if (orderCode) {
      document.forms.main.order_code.value = orderCode;
    }

    orders.fetch({
      success: function() {
        if (orderCode) {
          orderCodeView.renderOrder(orderCode);
        }
      }
    });
  }
});

