(function() {
  var renderStarRating;

  renderStarRating = function({rating, maxStars}) {
    var emptyStar, wholeStar;
    return <aside title={`Rating: ${rating} of ${maxStars} stars`}>
    {(function() {
      var i, ref, results;
      results = [];
      for (wholeStar = i = 0, ref = Math.floor(rating); undefined !== 0 && (0 <= ref ? 0 <= i && i < ref : 0 >= i && i > ref); wholeStar = 0 <= ref ? ++i : --i) {
        results.push(<Star className="wholeStar" key={wholeStar} />);
      }
      return results;
    })()}
    {(rating % 1 !== 0 ? <Star className="halfStar" /> : void 0)}
    {(function() {
      var i, ref, ref1, results;
      results = [];
      for (emptyStar = i = ref = Math.ceil(rating), ref1 = maxStars; undefined !== 0 && (ref <= ref1 ? ref <= i && i < ref1 : ref >= i && i > ref1); emptyStar = ref <= ref1 ? ++i : --i) {
        results.push(<Star className="emptyStar" key={emptyStar} />);
      }
      return results;
    })()}
  </aside>;
  };

}).call(this);
