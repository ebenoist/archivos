window.CustomerFormView = Backbone.View.extend({
  el: $("#customer-form-submit"),
  form: $("#customer-form"),

  events: {
    "click": "createCustomer"
  },

  createCustomer: function(event) {
    var self = this;

    event.preventDefault();

    var customerData = serializeForm(self.form);
    var customer = new Customer(customerData);

    customer.save({}, {
      type: "post",
      success: function(model, response, options) {
        window.flash.displaySuccess("Created: " + JSON.stringify(model));
        window.customers.fetch();
      },

      error: function(model, response, options) {
        window.flash.displayError("Failed to create!!");
      }
    });

    return false;
  }
});

window.OrderFormView = Backbone.View.extend({
  el: $("#order-form-submit"),
  form: $("#order-form"),

  events: {
    "click": "createOrder"
  },

  createOrder: function(event) {
    var self = this;

    event.preventDefault();

    var orderData = serializeForm(self.form);
    var order = new Order(orderData);

    order.save({}, {
      success: function(model, response, options) {
        window.flash.displaySuccess("Created: " + JSON.stringify(model));
        window.orders.fetch();
      },

      error: function(model, response, options) {
        window.flash.displayError("Failed to create!!");
      }
    });

    return false;
  }
});

window.FlashView = Backbone.View.extend({
  el: "#flash",

  displaySuccess: function(message) {
    var self = this;

    $(self.el).toggleClass("alert-success");
    self.display(message);
  },

  displayError: function(message) {
    var self = this;

    $(self.el).toggleClass("alert-error");
    self.display(message);
  },

  display: function(message) {
    var self = this;

    $(self.el).append(message);
    $(self.el).css("visibility", "visible");

    setTimeout(function() {
      $(self.el).css('visibility', 'hidden');
      $(self.el).empty();
      $(self.el).removeClass("alert-success");
      $(self.el).removeClass("alert-error");
    }, 4000);
  }

})

var AdminRouter = Backbone.Router.extend({
  initialize: function() {
    window.orders = new OrderList();
    window.customers = new CustomerList();

    window.customerList = new CustomerListView({ collection: window.customers });

    window.customerFormView = new CustomerFormView();
    window.orderFormView = new OrderFormView();
    window.flash = new FlashView();
    window.orderListView = new OrderListView({ collection: window.orders });
    window.customerViewList = new CustomerEditListView({ collection: window.customers });

    window.orders.fetch();
    window.customers.fetch();
  }
});

