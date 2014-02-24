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

function serializeForm(el) {
  var form = el.serializeArray();
  var obj = {};

  _.reduce(form, function (hash, pair) {
    hash[pair.name] = pair.value;
    return obj;
  }, obj);

  return obj;
}

