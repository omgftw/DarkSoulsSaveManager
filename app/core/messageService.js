var messagesService = function ($mdToast) {
    var svc = this;

    svc.backupCreated = "Save backup created";
    svc.backupRestored = "Save successfully restored";
    svc.backupDeleted = "Save successfully deleted";
    svc.backupRenamed = "Save renamed successfully";
    svc.saveImported = "Save imported as ";
};


angular
    .module("app")
    .service("messages", ["$mdToast", messagesService]);