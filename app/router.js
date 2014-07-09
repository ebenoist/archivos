App.AdminRouter = Backbone.Router.extend({
  initialize: function() {
    window.orders = new App.OrderList();
    window.customers = new App.CustomerList();

    window.customerList = new App.CustomerListView({ collection: window.customers });

    window.customerFormView = new App.CustomerFormView();
    window.orderFormView = new App.OrderFormView();
    window.flash = new App.FlashView();
    window.orderListView = new App.OrderListView({ collection: window.orders });
    window.customerViewList = new App.CustomerEditListView({ collection: window.customers });

    window.orders.fetch();
    window.customers.fetch();
  }
});

App.Router = Backbone.Router.extend({
  initialize: function() {
    params = getQueryParams(document.location.search);

    var orders = new App.OrderList();
    var orderCodeView = new App.OrderCodeView({
      collection: orders,
      el: $("#checkOrder")
    });

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
