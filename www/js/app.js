var App = (App || {})
;App.CustomerFormView = Backbone.View.extend({
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
;App.Archivo = Backbone.Model.extend({
  idAttribute: "_id",
  urlRoot: "/v1/archivos",

  status: function() {
    if (this._uploaded()) {
      return "uploaded";
    } else {
      return "uploading";
    }
  },

  _uploaded: function() {
    if (this.get("public_uri") != null) {
      return true;
    } else {
      return false;
    }
  }
});

App.ArchivoList = Backbone.Collection.extend({
  model: App.Archivo,

  initialize: function(data) {
    this.url = "/v1/archivos?order_code=" + data.order_code;
  },
})

App.ArchivoView = Backbone.View.extend({
  tagName: 'tr',

  render: function(eventName) {
    $(this.el).html(_.template($("#upload-list-template").html(), { archivo: this.model }));
    return this;
  }
});

App.ArchivoListView = Backbone.View.extend({
  el: $("#upload-file-list"),

  initialize: function() {
    $("#upload").show();
    $(".upload-file-list").show();

    this.$el.empty()
    self = this;

    this.collection.on("add", function(model) {
      $(self.el).append(new App.ArchivoView({ model: model }).render().el);
    });
  },
});
;App.Customer = Backbone.Model.extend({
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
;function getQueryParams(qs) {
    qs = qs.split("+").join(" ");

    var params = {}, tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
}

function serializeForm(el) {
  var form = el.serializeArray();
  var obj = {};

  _.reduce(form, function (hash, pair) {
    hash[pair.name] = pair.value;
    return obj;
  }, obj);

  return obj;
}

;App.OrderCodeView = Backbone.View.extend({
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
;App.AdminRouter = Backbone.Router.extend({
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
