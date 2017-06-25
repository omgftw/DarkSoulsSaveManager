(function () {
    var mainController = function ($scope, $location, $mdDialog, $mdToast, core, dialogService, messages) {
        var vm = this;
        var fs = require("fs");
        var path = require("path");
        const {shell, dialog} = require('electron').remote;

        //ensure welcome screen initialization
        if (!core.data.settings.saveFileLocation) {
            $location.path("/");
            return;
        }

        //ensure saves folder existence
        if (!fs.existsSync(core.data.settings.saveDirectory)) {
            fs.mkdirSync(core.data.settings.saveDirectory);
        }

        vm.settingsPage = function () {
            $location.path("/settings");
        };

        vm.saves = core.data.saves;
        vm.categories = core.data.categories;
        vm.settings = core.data.settings;
        // vm.selectedCategory = null;

        vm.openMenu = function ($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };

        vm.openSaveBackupFolder = function (event) {
            //append a (non-existent file) to ensure it opens the actual directory instead of the parent directory
            var folder = path.join(vm.settings.saveDirectory, "a");
            var fullPath = path.resolve(folder);
            shell.showItemInFolder(fullPath);
        };

        vm.importSave = function (event) {
            dialog.showOpenDialog({
                properties: ['openFile'],
                // defaultPath: defaultPath,
                filters: [
                    { name: 'Dark Souls Save', extensions: ['sl2'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            }, function (filePath) {
                if (filePath && filePath.length > 0) {
                    var fileName = path.win32.basename(filePath[0]);
                    var backupFilePath = core.createBackup(filePath[0]);
                    core.showSuccessToast(messages.saveImported + path.win32.basename(backupFilePath));
                }
            });
        };

        vm.categorySelect = function () {
            if (vm.settings.selectedCategory) {
                vm.saves = _.filter(core.data.saves, { category: vm.settings.selectedCategory });
            } else {
                vm.saves = core.data.saves;
            }
        };

        vm.createBackup = function () {
            core.createBackup(vm.settings.selectedCategory);
            vm.categorySelect();
        };

        vm.restoreSave = function (id, event) {
            core.restoreSave(id, event);
        };

        vm.deleteSave = function (id, event) {
            var confirm = $mdDialog.confirm()
                .title('Confirm Delete')
                .textContent('Are you sure you want to delete this save?')
                .ariaLabel('Confirm Delete')
                .ok('Delete')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                core.deleteSave(id, event);
                vm.categorySelect();
            }, function () {
                //cancel
            });
        };

        vm.renameSave = function (id, fileName, event) {
            var confirm = $mdDialog.prompt()
                .title('Rename Save')
                .textContent('Please enter a new name for this save')
                .placeholder(fileName)
                .ariaLabel("Save Name")
                .ok('Update')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function (result) {
                core.renameSave(id, result, event)
            }, function () {
                //cancel
            });
        }

        vm.selectSave = function (id, event) {
            core.selectSave(id, event);
        };

        vm.addCategory = function (event) {
            var confirm = $mdDialog.prompt()
                .title('Add Category')
                .textContent('Please enter name for this category')
                .placeholder("Category Name")
                .ariaLabel("Category Name")
                .ok('Add')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function (result) {
                core.addCategory(result, event)
            }, function () {
                //cancel
            });
        }

        vm.removeCategory = function (event) {
            if (vm.settings.selectedCategory) {
                var confirm = $mdDialog.confirm()
                    .title('Confirm Delete')
                    .textContent('Are you sure you want to delete this category?')
                    .ariaLabel('Confirm Delete')
                    .ok('Delete')
                    .cancel('Cancel');

                $mdDialog.show(confirm).then(function () {
                    core.removeCategory(vm.settings.selectedCategory, event);
                    vm.settings.selectedCategory = null;
                    vm.categorySelect();
                }, function () {
                    //cancel
                });
            }
        };

        vm.changeCategory = function (saveId, saveName, event) {
            dialogService.categoryDialog(saveId, saveName, event).then(function (selectedCategory) {
                core.changeCategory(saveId, selectedCategory, event);
            }, function () { });
        };

        vm.categorySelect();
        core.registerShortcuts();

        //register function for global use
        core.functionManager.add("categorySelect", vm.categorySelect);
    };

    angular.module("app").controller("mainController", ["$scope", "$location", "$mdDialog", "$mdToast", "core", "dialogService", "messages", mainController]);
})();