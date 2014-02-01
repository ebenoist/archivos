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

  initialize: function(order_id, count) {
    this.order_id = order_id;
    this.count = count;
  },

  url: function() {
    return "/v1/media" + "?order_id=" + this.order_id;
  }
})

window.MediaView = Backbone.View.extend({
  tagName: 'tr',

  initialize: function() {
    _.bindAll(this, "render");
     this.model.on("change", this.render, this);
  },

  pollForChanges: function() {
    // var timer = setInterval(function() { mediaList.fetch(); }, 1000); // dirty hack
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
    event.preventDefault();

    var formData = new FormData(document.forms.main);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "/v1/media", true);
    xhr.send(formData);

    mediaList = new MediaList(formData.order_code.value, formData.files.files.length);
    return false;
  }
});


var ArchivosRouter = Backbone.Router.extend({
  initialize: function() {
    // var mediaList = new MediaList();
    mediaList.fetch({
      success: function(data) {
        new MediaListView({ collection: data }).render();
      }
    });

    new UploadView({ el: $("#jsSubmit") });
  }
});

window.app = new ArchivosRouter();
Backbone.history.start();
