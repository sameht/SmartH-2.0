// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var appContext=angular.module('starter', ['ionic','ngCordova'])

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
    .state('menu',{
      url : '/menu',
      cache : false,
      abstract: true,
      templateUrl : 'menu/app-menu.html',
      controller : 'MenuController'
    })

    .state('menu.home',{
      url : '/home',
      cache : false,
      views: {
        'menuContent': {
          templateUrl: "home/home.html",
          controller : 'HomeController'
        }
      }
    })

    .state('menu.listConsultation',{
      url : '/listConsultation',
      cache : false,
      views: {
        'menuContent': {
          templateUrl: "consultation/template/list-consultation.html",
          controller : 'ListConsultationController'
        }
      }
    })

    .state('menu.consultation',{
      url : '/consultation',
      cache : false,
      views: {
        'menuContent': {
          templateUrl: "consultation/template/consultation.html",
          controller : 'ConsultationController'
        }
      }
    })

    .state('menu.listRdv',{
      url : '/listRdv',
      cache : false,
      views: {
        'menuContent': {
          templateUrl: "rdv/template/list-rdv.html",
          controller : 'ListRdvController'
        }
      }
    })

    .state('menu.rdv',{
      url : '/rdv',
      cache : false,
      views: {
        'menuContent': {
          templateUrl: "rdv/template/rdv.html",
          controller : 'RdvController'
        }
      }
    })

    .state('menu.searchDoctor',{
      url : '/searchDoctor',
      cache : false,
      views: {
        'menuContent': {
          templateUrl: "doctor/template/search-doctor.html",
          controller : 'DoctorLocatorController'
        }
      }
    })

    .state('menu.resultDoctor',{
      url : '/resultDoctor',
      cache : false,
      views: {
        'menuContent': {
          templateUrl: "doctor/template/result-doctor.html",
          controller : 'ResultDoctorController'
        }
      }
    })
    .state('menu.doctor',{
      url : '/doctor',
      cache : false,
      views: {
        'menuContent': {
          templateUrl: "doctor/template/doctor.html",
          controller : 'DoctorController'
        }
      }
    })
    ;

  $urlRouterProvider.otherwise('/menu/home')
})