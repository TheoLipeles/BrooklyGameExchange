app.directive('singleReview', function () {
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/singleReview/single-review.html',
		controller: function($scope){
			$scope._ = _;
		}
	};
});