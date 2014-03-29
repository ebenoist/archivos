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

window.OrderLineItemEditView = Backbone.View.extend({
  events: {
    "click": "toggleEdit"
  },

  el: function() {
    return "#order-line-" + this.model.get("_id");
  },

  swapDatePicker: function() {
    var dateEl = $(this.el).find("#delivery-date");
    var fullDate = new Date(this.model.get("delivery_date"));
    var simpleDate = fullDate.toISOString().slice(0,10);
    var newInput = "<input value='" + simpleDate + "' type='date' id='delivery-date'/>"
    dateEl.html(newInput);
  },

  toggleEdit: function() {
    this.undelegateEvents();
    this.edit();
  },

  edit: function(event) {
    this.swapDatePicker();
    $(this.el).find("#edit-controls").hide();
    $(this.el).find("#save-" + this.model.get("_id")).toggleClass("hidden");

    new OrderLineItemSaveView({ "parentDiv": $(this.el), "model": this.model });
  },
});

window.OrderLineItemSaveView = Backbone.View.extend({
  initialize: function(data) {
    $(this.el).click(this.save());
  },

  el: function() {
    if (this.parentDiv != null) {
      this.parentDiv.find("#save-" + this.model.get("_id"));
    }
  },

  save: function() {
    var newDate = $(this.el).find("#delivery-date").value();
    this.model.set("delivery_date", newDate);
    this.model.save();
  }
})

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

