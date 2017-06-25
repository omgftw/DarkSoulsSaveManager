(function () {

    var categoryDialogController = function ($scope, $mdDialog, locals) {
        $scope.selectedCategory = null;
        $scope.saveName = locals.saveName;
        $scope.categories = locals.core.data.categories;

        $scope.confirm = function () {
            $mdDialog.hide($scope.selectedCategory);
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        // $scope.keypress = function ($event) {
        //     if ($event.keyCode === locals.$mdConstant.KEY_CODE.ENTER) {
        //         $scope.confirm();
        //     }
        // };
    };

    var dialogService = function ($mdDialog, core, $mdConstant) {
        var svc = this;

        svc.categoryDialog = function (saveId, saveName, event) {
            return $mdDialog.show(
                {
                    templateUrl: "./app/custom/dialog/templates/categorySelect.html",
                    // clickOutsideToClose: true,
                    controller: categoryDialogController,
                    locals: {
                        saveId: saveId,
                        saveName: saveName,
                        core: core,
                        $mdConstant: $mdConstant
                    }
                });
        };
    };

    angular.module("app")
        .service("dialogService", ["$mdDialog", "core", "$mdConstant", dialogService]);

})();