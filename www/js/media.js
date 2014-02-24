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
  },
})

window.MediaView = Backbone.View.extend({
  tagName: 'tr',

  initialize: function() {
  },

  render: function(eventName) {
    $(this.el).html(_.template($("#upload-list-template").html(), { media: this.model }));
    return this;
  }
});

window.MediaListView = Backbone.View.extend({
  el: $("#upload-file-list"),

  initialize: function() {
    $("#upload").show();
    $(".upload-file-list").show();

    this.$el.empty()
    console.log(this.collection);
    var self = this;

    this.collection.on("add", function(model) {
      console.log("adding" + model.toJSON());
      $(self.el).append(new MediaView({ model: model }).render().el);
    });
  },
});
