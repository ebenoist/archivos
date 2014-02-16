serializeForm = function(el) {
  var form = el.serializeArray();
  var obj = {};

  _.reduce(form, function (hash, pair) {
    hash[pair.name] = pair.value;
    return obj;
  }, obj);

  return obj;
}

window.Order = Backbone.Model.extend({
  idAttribute: "_id",
  urlRoot: "/v1/orders",
});

window.OrderList = Backbone.Collection.extend({
  model: Order,
  url: "/v1/orders",
});

window.Customer = Backbone.Model.extend({
  idAttribute: "_id",
  urlRoot: "/v1/customer"
});

window.CustomerList = Backbone.Collection.extend({
  model: Customer,
  url: "/v1/customer"
})

window.CustomerListView = Backbone.View.extend({
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

    $(self.el).fadeIn();
    $(self.el).append(message);

    setTimeout(function() {
      $(self.el).fadeOut();
      $(self.el).empty();
      $(self.el).removeClass("alert-success");
      $(self.el).removeClass("alert-error");
    }, 4000);
  }
})

window.Media = Backbone.Model.extend({
  idAttribute: "_id",
  urlRoot: "/v1/media",

  file_name: function() {
    if (this._uploaded()) {
      return this._file_name_as_link();
    } else {
      return this.get("file_name");
    }
  },

  _uploaded: function() {
    if (this.get("public_uri") != null) {
      return true;
    } else {
      return false;
    }
  },

  _file_name_as_link: function() {
    return "<a href=\"" + this.get("public_uri") + "\">" + this.get("file_name") + "</a>";
  }
});

window.MediaList = Backbone.Collection.extend({
  model: Media,

  initialize: function(data) {
    this.url = "/v1/media?order_code=" + data.order_code;
  }
})

window.MediaView = Backbone.View.extend({
  tagName: 'tr',

  initialize: function() {
    _.bindAll(this, "render");
     this.model.on("change", this.render, this);
  },

  render: function(eventName) {
    $(this.el).html(_.template($("#upload-list-template").html(), { media: this.model }));
    return this;
  }
});

window.MediaListView = Backbone.View.extend({
  el: $("#upload-file-list"),

  initialize: function() {
    var self = this;
    this.collection.bind("reset", this.render. this);
    this.collection.bind("add", function(media) {
      $(self.el).append(new MediaView({ model: media }).render().el);
    });
  },

  render: function(eventName) {
    $(this.el).empty();
    _.each(this.collection.models, function(media) {
      $(this.el).append(new MediaView({ model: media }).render().el);
    }, this);

    return this;
  }
});

window.UploadView = Backbone.View.extend({
  events: {
    "click": "uploadSubmit"
  },

  uploadSubmit: function(event) {
    mediaList = new MediaList(formData.order_code.value);
    return false;
  }
});

window.OrderCodeView = Backbone.View.extend({
  events: {
    "click": "checkOrder",
  },

  renderOrder: function(order_code) {
    var self = this;
    order = this.collection.findWhere({ order_code: order_code });

    if (order != null) {
      var mediaList = new MediaList({ order_code: order.get("order_code") });
      mediaList.fetch({
        success: function(data) {
          $("#upload").show();
          $(".upload-file-list").show();
          new MediaListView({ collection: data }).render();
        }
      });
    } else {
      // flash
    }
  },

  checkOrder: function(event) {
    event.preventDefault();

    this.renderOrder(document.forms.main.order_code.value);
    return false;
  }

});

function getQueryParams(qs) {
    qs = qs.split("+").join(" ");

    var params = {}, tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
}

var ArchivosRouter = Backbone.Router.extend({
  initialize: function() {
    params = getQueryParams(document.location.search);
    if (params.order_code) {
      var order_code = params.order_code;
      document.forms.main.order_code.value = order_code;

      var mediaList = new MediaList({ order_code: order_code }); // TODO: DRY
      mediaList.fetch({
        success: function(data) {
          $("#upload").show();
          $(".upload-file-list").show();
          new MediaListView({ collection: data }).render();
        }
      });

    } else {
      var orders = new OrderList();

      orders.fetch({
        success: function() {
          var orderView = new OrderCodeView({ collection: orders, el: $("#checkOrder") });
          orderView.renderOrder(params.order_code);
        }
      });
    }

    new UploadView({ el: $("#submit") });
  }
});

