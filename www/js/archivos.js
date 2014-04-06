window.Archivo = Backbone.Model.extend({
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

window.ArchivoList = Backbone.Collection.extend({
  model: Archivo,

  initialize: function(data) {
    this.url = "/v1/archivos?order_code=" + data.order_code;
  },
})

window.ArchivoView = Backbone.View.extend({
  tagName: 'tr',

  initialize: function() {
  },

  render: function(eventName) {
    $(this.el).html(_.template($("#upload-list-template").html(), { archivo: this.model }));
    return this;
  }
});

window.ArchivoListView = Backbone.View.extend({
  el: $("#upload-file-list"),

  initialize: function() {
    $("#upload").show();
    $(".upload-file-list").show();

    this.$el.empty()
    var self = this;

    this.collection.on("add", function(model) {
      $(self.el).append(new ArchivoView({ model: model }).render().el);
    });
  },
});
