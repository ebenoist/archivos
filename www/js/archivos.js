window.Media = Backbone.Model.extend({
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
  url: "/v1/media"
})

window.MediaView = Backbone.View.extend({
  tagName: 'tr',

  initialize: function() {
    _.bindAll(this, "render");
     this.model.bind('change', this.render);
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
    // this.collection.bind("add", function(media) {
      // $(self.el).append(new MediaView({ model: media }).render().el);
    // });
  },

  render: function(eventName) {
    $(this.el).empty();
    _.each(this.collection.models, function(media) {
      $(this.el).append(new MediaView({ model: media }).render().el);
    }, this);

    return this;
  }
});


var ArchivosRouter = Backbone.Router.extend({
  initialize: function() {
    var mediaList = new MediaList();
    mediaList.fetch({
      success: function(data) {
        new MediaListView({ collection: data }).render();
      }
    });
  }
});

window.app = new ArchivosRouter();
Backbone.history.start();
