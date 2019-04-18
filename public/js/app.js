var todoApp = angular.module("todoApp", []);

todoApp.controller("todoListCtrl",["$scope", "$http", 'todoService', function($scope, $http, todoService){

    $scope.taskList = [];

    $scope.howManyDone = function(){
        count = 0;
        $scope.taskList.forEach(element => {
            if(element.done){
                count++
            }
        });
        return count;
    };

    $scope.howManyNotDone = function(){
        return $scope.taskList.length
            -$scope.howManyDone();
    };

    $scope.addTask = function(){
        // Ajout dans la liste

        todoService.addTask($scope.$parent.username, $scope.taskInputName, function(res){
            if(res){
                console.log(res);
                console.log("task added");
                $scope.load();
            }
        });
        $scope.taskInputName = "";
    };

    $scope.update = function(task){

        todoService.updateTask(task, function(res){
            console.log(res);
            $scope.load();
        });
    };

    $scope.delete = function(task){
        var index = $scope.taskList.indexOf(task);
        $scope.taskList.splice(index,1);

        todoService.deleteTask(task._id, function(res){
            console.log(todo);
            $scope.load();
        });
    };

    $scope.store = function(){
        localStorage.setItem("taskList", JSON.stringify($scope.taskList));
    };

    $scope.load = function(){
        todoService.getTaskSet($scope.username, function(res){
            $scope.taskList = res;
        });
    };

    $scope.deconnect = function(){
        $scope.$parent.connected = false;
        $scope.$parent.username = "";
        $scope.$parent.error = false;
        $scope.$parent.password = "";
    };

    $scope.$parent.$on("LoadTasksEvent",function(){
        $scope.load();
    });


}]);

todoApp.controller("connexionCtrl", ["$scope", "$http", 'todoService', function($scope, $http, todoService){

    $scope.addAccount = function(){
        // Ajout dans la liste

        todoService.addAccount($scope.username, $scope.password, function(res){
            if(res){
                console.log(res);
                if(res.success){
                    console.log("user added");
                    $scope.$parent.connected = res.success;
                    $scope.$parent.error = false;
                    $scope.$parent.username = res.username;
                    $scope.$parent.$emit("LoadTasksEvent",{});
                }else{
                    $scope.$parent.error = true;
                    $scope.$parent.password = "";
                }
            }
        });
    };

    $scope.connect = function () {
        todoService.findAccount($scope.username, $scope.password, function(res){
            if(res){
                console.log(res);
                if(res.success){
                    console.log("user connected");
                    $scope.$parent.connected = res.success;
                    $scope.$parent.error = true;
                    $scope.$parent.username = res.username;
                    $scope.$parent.$emit("LoadTasksEvent",{});
                }else{
                    $scope.$parent.error = true;
                    $scope.$parent.password = "";
                }
            }
        });
    }
}]);

todoApp.controller("pageCtrl",["$scope",function ($scope) {

    $scope.connected = false;
    $scope.username = "";
    $scope.error = false;
}]);
