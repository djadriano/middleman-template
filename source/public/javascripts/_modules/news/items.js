app.filter('limitListDesc', function() {
  return function( text, size ) {
    var maximum_letters = {
      small  : 96,
      medium : 280,
      large  : 300
    };

    if( text.length <= maximum_letters[ size ] ) {
      return text
    } else {
      return text.substring( 0, maximum_letters[ size ] ) + '...';
    }
  }
});

app.controller('NewsItemsController', ['$scope', '$window', '$http',function( $scope, $window, $http ) {

  // Variables
  // ---------------------------------------------------------

  var count_animated_items = 0;
  $scope.items             = [];
  $scope.next_page_path    = null;

  // Methods
  // ---------------------------------------------------------

  // get the initial items to list
  $scope.getItems = function(url) {
    return $http({ method: 'GET', url: ($scope.next_page_path ? $scope.next_page_path : $scope.news_load_path)});
  };

  // animate items method
  $scope.animateItems = function( items ) {

    var total = items.length;

    animate_items = $window.setInterval(function() {

      if( ( count_animated_items + 1 ) <= total ) {

        $scope.items.push( items[ count_animated_items ] );
        $scope.$apply();

        count_animated_items++;

      } else {

        $window.clearInterval( animate_items );

      }

    }, 350);

  };

  // load more items
  $scope.loadMoreItems = function() {

    var actual_items = $scope.items;
    var new_items    = '';

    $scope.getItems().then(function( response ) {

      $scope.next_page_path = response.data.next_page_path;
      new_items             = actual_items.concat( response.data.contents );

      $scope.animateItems( new_items );

    });

  };

  $scope.initialize = function( load_path ) {

    $scope.news_load_path = load_path;

    // initialize get items
    $scope.getItems().then(function( response ) {
      console.log(response);
      $scope.next_page_path = response.data.next_page_path;
      $scope.animateItems( response.data.contents );
    });

  };

}]);