$(document).ready(function(){
  var apiUrl = 'http://52.87.169.25:8081/api/';
  var url = window.location.href;
    var baseUrl = '';
    if (url.indexOf("localhost") > -1) { 
      baseUrl = 'http://localhost:3000/';
    } else {
      if (window.location.hostname.indexOf("www") == 0) { window.location = window.location.href.replace("www.",""); }
      baseUrl = 'https://ra-ui-poc.herokuapp.com/';
    }
  $(".loginUser").click(function() {
    var username = $("#username").val();
    var password = $("#password").val();
    var loginData = {username : username, password : password };
    var url = 'login';
    console.log(loginData);
    httpCall(url,loginData,'POST', function(result) {
      console.log(result);
      localStorage.setItem('raToken',result.token);
      localStorage.setItem('raUserName',result.username);
      toastr.success('Login Success!');
      setTimeout(function(){ 
        window.location.replace(baseUrl+"dashboard");
       }, 1000);
    });
  });

  function httpCall(url, data, method, callback) {
    console.log(url);
    console.log(data);
    console.log(method);
    if(_.isEmpty(data)){
      data = null;
    } else {
      data = JSON.stringify(data);
    }
    $.ajax({
      url: apiUrl+url,
      dataType : 'json',
      contentType: "application/json",
      method: method,
      headers: {
        'Authorization': "Bearer "+localStorage.getItem('raToken')
      },
      data: data,
      success: function (response) {
          callback(response);
      },
      error: function (jqXHR, exception) {
        toastr.error(jqXHR.responseText);
        console.log(jqXHR.responseText);
      },
  });
    // $.ajax({
    //     url: baseUrl+url,
    //     dataType : 'json',
    //     contentType: "application/json",
    //     Accept: 'application/json',  // It can be used to overcome cors error
    //     // headers: {
    //     //     'X-CSRF-TOKEN':$('meta[name="csrf-token"]').attr('content')
    //     // },
    //     method: method,
    //     data: JSON.stringify(data),
    //     success: function(data){
    //         callback(data);
    //     },
    //     error: function(jqXHR, exception){
    //       console.log.apply(jqXHR);
    //       console.log.apply(exception);
    //     }
    // });
  }
  // Decide and load
  var page = '';
  var userList; var systemList;
  if (url.indexOf("users") > -1) {  // load user master
    page = 'User';
    loadUser();
  }
  if (url.indexOf("system") > -1) {  // load user master
    page = 'System';
    loadSystem();
  }

  function loadUser(url){
    httpCall('listUsers',{},'POST', function(result) {
      toastr.success('User list loaded');
      var array = result.data;
      userList = result.data;
      var t = $('#example').DataTable();
      t.clear().draw();
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
          t.row.add( [
            element.id,
            element.username,
            '<button class="btn btn-warning userEditBtn" data-toggle="modal" data-target="#userModal" id="'+element.id+'">Edit</button>'
        ] ).draw( false );
      }
      t.order([0,'desc']).draw()});
  }

  function loadSystem(url){
    httpCall('admin/getSystemList',{},'GET', function(result) {
      toastr.success('System list loaded');
      var array = result.data;
      systemList = result.data;
      var t = $('#example').DataTable(); 
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
          t.row.add( [
            element.id,
            element.systemname,
            '<button class="btn btn-info view" data-toggle="modal" data-target="#viewModal" id="id'+element.id+'">View</button>',
            '<button class="btn btn-warning systemEditBtn" data-toggle="modal" data-target="#userModal" id="'+element.id+'">Edit</button>'
        ] ).draw( false );
      }
      t.order([0,'desc']).draw()});
  }

  $(document).on("click",".userEditBtn",function() {
    var action = 'Edit ';
    $(".popTitle").html(action+page);
    $(".editUser").show();
    $(".addUser").hide();
    $(".editSystem").show();
    $(".addSystem").hide();
    console.log(this.id);
    var id = parseInt(this.id);
    var item = _.find(userList, {id: id});
    $("#userId").val(id);
    $("#username").val(item.username);
    $("#password").val('');
  });
  $(document).on("click",".userCreateBtn",function() {
    var action = 'Create ';
    $("#username").val('');
    $("#password").val('');
    $(".popTitle").html(action+page);
    $(".editUser").hide();
    $(".addUser").show();
    $(".editSystem").hide();
    $(".addSystem").show();
  });
  $(document).on("click",".addUser",function() {
    var username = $("#username").val();
    var password = $("#password").val();
    var userData = {username : username, password : password };
    var url = 'addUser';
    console.log(userData);
    httpCall(url,userData,'POST', function(result) {
      console.log(result);
      if(result.errorMessage){
        toastr.error(result.errorMessage);
      }
      if(result.successMessage){
        loadUser();
        toastr.success(result.successMessage);
      }
    });
  });
  $(document).on("click",".editUser",function() {
    var username = $("#username").val();
    var password = $("#password").val();
    var id = $("#userId").val();
    var userData = {username : username, password : password, id : id };
    var url = 'addUser';
    console.log(userData);
    httpCall(url,userData,'POST', function(result) {
      console.log(result);
      if(result.errorMessage){
        toastr.info(result.errorMessage);
      }
      if(result.successMessage){
        loadUser();
        $( ".closeBtn" ).trigger( "click" );
        toastr.info(result.successMessage);
      }
    }); 
  });
  $(document).on("click",".systemEditBtn",function() {
    var action = 'Edit ';
    $(".popTitle").html(action+page);
    $(".editUser").show();
    $(".addUser").hide();
    $(".editSystem").show();
    $(".addSystem").hide();
    console.log(this.id);
    var id = parseInt(this.id);
    var item = _.find(systemList, {id: id});
    $("#userId").val(id);
    $("#hostname").val(item.hostname);
    $("#systemname").val(item.systemname);
  });
  $(document).on("click",".systemCreateBtn",function() {
    var action = 'Create ';
    $("#username").val('');
    $("#password").val('');
    $(".popTitle").html(action+page);
    $(".editUser").hide();
    $(".addUser").show();
    $(".editSystem").hide();
    $(".addSystem").show();
  });
  $(document).on("click",".addSystem",function() {
    var systemname = $("#systemname").val();
    var hostname = $("#hostname").val();
    var userData = {systemname : systemname, hostname : hostname };
    var url = 'admin/addSystem';
    console.log(userData);
    httpCall(url,userData,'POST', function(result) {
      console.log(result);
      if(result.errorMessage){
        toastr.error(result.errorMessage);
      }
      if(result.successMessage){
        loadSystem();
        toastr.success(result.successMessage);
      }
    });
  });
  $(document).on("click",".editSystem",function() {
    var id = $("#userId").val();
    var systemname = $("#systemname").val();
    var hostname = $("#hostname").val();
    var userData = {id : id, systemname : systemname, hostname : hostname };
    var url = 'admin/addSystem';
    console.log(userData);
    httpCall(url,userData,'POST', function(result) {
      console.log(result);
      if(result.errorMessage){
        toastr.error(result.errorMessage);
      }
      if(result.successMessage){
        loadSystem();
        $( ".closeBtn" ).trigger( "click" );
        toastr.success(result.successMessage);
      }
    });
  });

  toastr.options = {
    "debug": false,
    "positionClass": "toast-bottom-right",
    "onclick": null,
    "fadeIn": 300,
    "fadeOut": 1000,
    "timeOut": 3000,
    "extendedTimeOut": 1000
  }
  $(".username").html(localStorage.getItem('raUserName'));
});