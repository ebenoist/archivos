App.CustomerFormView = Backbone.View.extend({
  el: $("#customer-form-submit"),
  form: $("#customer-form"),

  events: {
    "click": "createCustomer"
  },

  createCustomer: function(event) {
    self = this;

    event.preventDefault();

    customerData = serializeForm(self.form);
    customer = new Customer(customerData);

    customer.save({}, {
      type: "post",
      success: function(model, response, options) {
        flash.displaySuccess("Created: " + JSON.stringify(model));
        customers.fetch();
      },

      error: function(model, response, options) {
        flash.displayError("Failed to create!!");
      }
    });

    return false;
  }
});

App.OrderFormView = Backbone.View.extend({
  el: $("#order-form-submit"),
  form: $("#order-form"),

  events: {
    "click": "createOrder"
  },

  createOrder: function(event) {
    self = this;

    event.preventDefault();

    orderData = serializeForm(self.form);
    order = new Order(orderData);

    order.save({}, {
      success: function(model, response, options) {
        flash.displaySuccess("Created: " + JSON.stringify(model));
        orders.fetch();
      },

      error: function(model, response, options) {
        flash.displayError("Failed to create!!");
      }
    });

    return false;
  }
});

App.FlashView = Backbone.View.extend({
  el: "#flash",

  displaySuccess: function(message) {
    self = this;

    $(self.el).toggleClass("alert-success");
    self.display(message);
  },

  displayError: function(message) {
    self = this;

    $(self.el).toggleClass("alert-error");
    self.display(message);
  },

  display: function(message) {
    self = this;

    $(self.el).append(message);
    $(self.el).css("visibility", "visible");

    setTimeout(function() { // replace with css
      $(self.el).css('visibility', 'hidden');
      $(self.el).empty();
      $(self.el).removeClass("alert-success");
      $(self.el).removeClass("alert-error");
    }, 4000);
  }
});
