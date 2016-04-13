// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var appContext=angular.module('starter', ['ionic','ngCordova', 'ngMaterial'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
   .state('startup',{
      url : '/startup',
      cache : false,
      templateUrl : 'app/startup/startup.html',
      controller : 'StartupController'
    })

   .state('synchronisation',{
      url : '/synchronisation',
      cache : false,
      templateUrl : 'app/startup/startup.html',
      controller : 'SynchronisationController'
    })


    .state('menu',{
      url : '/menu',
      cache : false,
      abstract: true,
      templateUrl : 'app/menu/app-menu.html',
      controller : 'MenuController'
    })

    .state('menu.home',{
      url : '/home',
      cache : false,
      views: {
        'menuContent': {
          templateUrl: "app/home/home.html",
          controller : 'HomeController'
        }
      }
    })

    .state('menu.listConsultation',{
      url : '/listConsultation',
      cache : false,
      views: {
        'menuContent': {
          templateUrl: "app/consultation/template/list-consultation.html",
          controller : 'ListConsultationController'
        }
      }
    })

    .state('menu.consultation',{
      url : '/consultation/{id:int}',
      cache : false,
      views: {
        'menuContent': {
          templateUrl: "app/consultation/template/consultation.html",
          controller : 'ConsultationController'
        }
      }
    })

    .state('menu.listRdv',{
      url : '/listRdv',
      cache : false,
      views: {
        'menuContent': {
          templateUrl: "app/rdv/template/list-rdv.html",
          controller : 'ListRdvController'
        }
      }
    })

    .state('menu.rdv',{
      url : '/rdv/{id:int}',
      cache : false,
      views: {
        'menuContent': {
          templateUrl: "app/rdv/template/rdv.html",
          controller : 'RdvController'
        }
      }
    })

    .state('menu.searchDoctor',{
      url : '/searchDoctor',
      cache : false,
      views: {
        'menuContent': {
          templateUrl: "app/doctor/template/search-doctor.html",
          controller : 'DoctorLocatorController'
        }
      }
    })

    .state('menu.resultDoctor',{
      url : '/resultDoctor',
      cache : false,
      views: {
        'menuContent': {
          templateUrl: "app/doctor/template/result-doctor.html",
          controller : 'ResultDoctorController'
        }
      }
    })
    .state('menu.doctor',{
      url : '/doctor',
      cache : false,
      views: {
        'menuContent': {
          templateUrl: "app/doctor/template/doctor.html",
          controller : 'DoctorController'
        }
      }
    })

    .state('menu.searchPharmacy',{
      url : '/searchPharmacy',
      cache : false,
      views: {
        'menuContent': {
          templateUrl: "app/pharmacy/template/search-pharmacy.html",
          controller : 'PharmacyLocatorController'
        }
      }
    })

    .state('menu.resultPharmacy',{
      url : '/resultPharmacy',
      cache : false,
      views: {
        'menuContent': {
          templateUrl: "app/pharmacy/template/result-pharmacy.html",
          controller : 'ResultPharmacyController'
        }
      }
    })
    .state('menu.pharmacy',{
      url : '/pharmacy',
      cache : false,
      views: {
        'menuContent': {
          templateUrl: "app/pharmacy/template/pharmacy.html",
          controller : 'PharmacyController'
        }
      }
    })

    .state('menu.compte',{
      url : '/compte',
      cache : false,
      views: {
        'menuContent': {
          templateUrl: "app/compte/compte.html",
          controller : 'CompteController'
        }
      }
    })

    .state('menu.setting',{
      url : '/setting',
      cache : false,
      views: {
        'menuContent': {
          templateUrl: "app/setting/setting.html",
          controller : 'SettingController'
        }
      }
    })

    .state('login',{
      url : '/login', 
      cache : false,
      templateUrl: "app/login/login.html",
      controller : 'LoginController'


    }) ;

  $urlRouterProvider.otherwise('/startup')
})