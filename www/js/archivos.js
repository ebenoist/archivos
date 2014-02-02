window.Order = Backbone.Model.extend({
  idAttribute: "order_code",
  urlRoot: "/v1/order",
});

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
    console.log("here");
    return false;
  }
});

window.OrderCodeView = Backbone.View.extend({
  events: {
    "click": "checkOrder",
  },

  renderOrder: function(order_code) {
    order = new Order({ order_code: order_code});

    order.fetch({
      success: function() {
        console.log("cool");

        var mediaList = new MediaList({ order_code: order.get("order_code") });
        mediaList.fetch({
          success: function(data) {
            $("#upload").show();
            new MediaListView({ collection: data }).render();
          }
        });
      }
    })
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
      document.forms.main.order_code.value = params.order_code;
      var orderView = new OrderCodeView({ el: $("#checkOrder") });
      orderView.renderOrder(params.order_code);
    } else {
     new OrderCodeView({ el: $("#checkOrder") });
    }

    new UploadView({ el: $("#submit") });
  }
});

window.app = new ArchivosRouter();
Backbone.history.start();
