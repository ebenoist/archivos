App.Archivo = Backbone.Model.extend({
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
