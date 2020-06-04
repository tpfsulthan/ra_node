$(document).ready(function(){
    var url = window.location.href;
    var baseUrl = '';
    if (url.indexOf("localhost") > -1) { 
      baseUrl = 'http://localhost:3000/';
    } else {
      if (window.location.hostname.indexOf("www") == 0) { window.location = window.location.href.replace("www.",""); }
      baseUrl = 'https://sulthanallaudeen.com/';
    }
    localStorage.setItem('baseUrl',baseUrl);
    var user_session = getCookie('saCookie');
    if (url.indexOf("login") > -1) { 
      if(localStorage.getItem('userName')==undefined){
      // if(user_session==undefined){
        // alert('in login page');
      } else {
        window.location.replace(baseUrl+"admin/dashboard");
      }
    } else if(
    url.indexOf("dashboard") > -1 || 
    url.indexOf("blog") > -1  || url.indexOf("create-blog") > -1 || 
    url.indexOf("tag") > -1 || url.indexOf("create-tag") > -1 || 
    url.indexOf("reminder") > -1 || url.indexOf("create-reminder") > -1 ||
    url.indexOf("secret") > -1 || url.indexOf("secretDetails") > -1
    ) {

    // if(user_session==undefined) {
    if(localStorage.getItem('userName')==undefined){
        // alert('forward to login');
        window.location.replace(baseUrl+"admin/logout");
      } else {
        // alert('We are good');
      }
    } else {
      // alert('Other page');
    }

    
  // Login
  $(".loginUser").click(function() {
    var email = $("#email").val();
    var password = $("#password").val();
    var loginData = {email : email, password : password };
    var url = 'admin/auth';
    console.log(loginData);
    httpCall(url,loginData,'POST', function(result) {
        if(result.success==1){
            Cookies.set('saCookie', result.token);
            localStorage.setItem('userName',result.data.username);
            localStorage.setItem('userImage',result.data.image);
            window.location.replace(baseUrl+"admin/dashboard");
        } else {
            showAlert('error',result.message);
        }
    });
  });

  // common function
  function httpCall(url, data, method, callback) {
    console.log(url);
    console.log(data);
    console.log(method);
    $.ajax({
        url: baseUrl+url,
        headers: {
            'X-CSRF-TOKEN':$('meta[name="csrf-token"]').attr('content')
        },
        method: method,
        // dataType: 'json',
        data: data,
        success: function(data){
            callback(data);
        }
    });
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

    


  });


  $(document).ready(function(){
    var baseUrl = localStorage.getItem('baseUrl');
    var url = window.location.href;
    setName();
    if (url.indexOf("admin/blog") > -1) { 
      httpCall("blog/list",{},'POST', function(result) {
        console.log(result);
        setTable(result.data,'edit-blog');
      });
    }
    if (url.indexOf("admin/tag") > -1) { 
      httpCall("tag/list",{},'POST', function(result) {
        console.log(result);
        setTable(result.data,'edit-tag');
      });
    }
    if(url.indexOf("create-blog")>-1){
      $( "#title" ).keyup(function() { var title =  $("#title").val(); var url = title.replace(/\s+/g, "-"); $("#url").val(url); });
      $("#date").inputmask("99/99/9999",{ "placeholder": "dd-mm-yyyy" });
      getTags(function (){
  
      })
    }
    if(url.indexOf("edit-blog")>-1){
      $( "#title" ).keyup(function() { var title =  $("#title").val(); var url = title.replace(/\s+/g, "-"); $("#url").val(url); });
      $("#date").inputmask("99/99/9999",{ "placeholder": "dd-mm-yyyy" });
      $(".text-primary").html('Edit Blog');
      $("#blogButton").attr('class', 'btn btn-primary float-right editBlog');
      $("#blogButton").html('Update');
      var urlSplit = url.split('=');
      var blogData = {id:urlSplit[1]};
      getTags(function (){
        httpCall("blog/getBlog",blogData,'POST', function(result) {
          setBlog(result.data);
        });  
      })
    }
    if(url.indexOf("create-tag")>-1){
      $( "#title" ).keyup(function() { var title =  $("#title").val(); var url = title.replace(/\s+/g, "-"); $("#url").val(url); });
    }
    if(url.indexOf("edit-tag")>-1){
      $( "#title" ).keyup(function() { var title =  $("#title").val(); var url = title.replace(/\s+/g, "-"); $("#url").val(url); });
      $(".text-primary").html('Edit Tag');
      $("#tagButton").attr('class', 'btn btn-primary float-right editTag');
      $("#tagButton").html('Update');
      var urlSplit = url.split('=');
      var blogData = {id:urlSplit[1]};
      httpCall("tag/getTag",blogData,'POST', function(result) {
        setTag(result.data);
      });
    }
    if (url.indexOf("dashboard") > -1) { 
      getDeviceStatus();
    }
    if (url.indexOf("secret") > -1) { 
      secretPage();
    }
    
    
  
    // $('#saTable').DataTable( {
    //   "processing": true,
    //   "stateSave": true,
    //   "pageLength": length,
    //       "serverSide": true,
    //       "ajax": table
    //   } );
  
  
  
    function getDeviceStatus(){
      httpCall('admin/getDeviceStatus', {},'GET',function(result) {
          console.log('result',result);
          if(result=="on"){
              $(".setDeviceStatus").attr('src','../images/device/fridge_on.png');
          } else {
              $(".setDeviceStatus").attr('src','../images/device/fridge_off.png');
          }
      });
  }
  
  $(".ping").click(function() {
    var id = this.id; var data = {};
    httpCall(id, data,'GET',function(result) {
        // toastr.success('Ping done Success!');
        showAlert('error',result.message);
    });
  });
  
  function setName(){
    $(".userName").html(localStorage.getItem('userName'));    
    $(".userImage").attr('src', "../images/"+localStorage.getItem('userImage'));
  }
  
  $(".setDeviceStatus").click(function() {
    httpCall('admin/setDeviceStatus', {},'POST',function(result) {
        getDeviceStatus();
    });
  });
  
  $(".createBlog").click(function() {
    var title = $("#title").val();
    var url = $("#url").val();
    var tags = [];
    $('input[name="tag"]:checked').each(function() {
      tags.push(this.value);
   });
    var content = CKEDITOR.instances['editor'].getData();
    var status = $('input[name="status"]:checked').val();
    var old_date = $("#date").val();
    var date = moment(old_date, "DD/MM/YYYY").toDate();
    var epoch = moment(old_date, "DD/MM/YYYY").valueOf();
    var tagData = pickTags(tags);
    var blogData = {title : title, url : url, tags:tagData.tagTitle, content:content, date:date,epoch : epoch, status:status };
    var postUrl = 'blog/create';
    console.log(blogData);
    httpCall(postUrl,blogData,'POST', function(result) {
        if(result.success==true){
            showAlert('error',result.message);
            window.location.replace(baseUrl+"admin/blog");
        } else {
            showAlert('error',result.message);
        }
    });
  });
  
  $(".createTag").click(function() {
    var title = $("#title").val();
    var url = $("#url").val();
    var content = CKEDITOR.instances['editor'].getData();
    var status = $('input[name="status"]:checked').val();
    var tagData = {title : title, url : url, content:content,status:status };
    var postUrl = 'tag/create';
    console.log(tagData);
    httpCall(postUrl,tagData,'POST', function(result) {
        if(result.success==true){
            showAlert('error',result.message);
            window.location.replace(baseUrl+"admin/tag");
        } else {
            showAlert('error',result.message);
        }
    });
  });
  
  $(".editBlog").click(function() {
    var id = $("#id").val();
    var title = $("#title").val();
    var url = $("#url").val();
    var tags = [];
    $('input[name="tag"]:checked').each(function() {
      tags.push(this.value);
   });
    var content = CKEDITOR.instances['editor'].getData();
    var status = $('input[name="status"]:checked').val();
    var old_date = $("#date").val();
    var date = moment(old_date, "DD/MM/YYYY").toDate();
    var epoch = moment(old_date, "DD/MM/YYYY").valueOf();
    var tagData = pickTags(tags);
    var blogData = {id : id,title : title, url : url, tags:tagData.tagTitle, content:content, date:date,epoch : epoch, status:status };
    var postUrl = 'blog/update';
    console.log(blogData);
    console.log('picking tag',tags);
    
    httpCall(postUrl,blogData,'POST', function(result) {
      if(result.success==true){
        showAlert('error',result.message);
        window.location.replace(baseUrl+"admin/blog");
    } else {
        showAlert('error',result.message);
    }
    });
  });
  
  function pickTags(tags){
    // console.log('getTags',tags);
    // console.log('Global tag',globalTags);
    var tagTitle = [];
    var tagArray = [];
    for (let index = 0; index < tags.length; index++) {
      const element = tags[index];
      console.log(element);
      var foundTag = _.findWhere(globalTags, {_id: element});
      tagTitle.push(foundTag.title);
      tagArray.push(foundTag);
      
    }
    var tagData = {tagTitle : tagTitle, tagArray : tagArray};
    return tagData;
  }
  
  $(".editTag").click(function() {
    var id = $("#id").val();
    var title = $("#title").val();
    var url = $("#url").val();
    var content = CKEDITOR.instances['editor'].getData();
    var status = $('input[name="status"]:checked').val();
    var tagData = {id : id,title : title, url : url, content:content, status:status };
    var postUrl = 'tag/update';
    httpCall(postUrl,tagData,'POST', function(result) {
      if(result.success==true){
        showAlert('error',result.message);
        window.location.replace(baseUrl+"admin/tag");
    } else {
        showAlert('error',result.message);
    }
    });
  });
  
  
  
  
    // common function
    function httpCall(url, data, method, callback) {
      console.log(url);
      console.log(data);
      console.log(method);
      $.ajax({
          url: baseUrl+url,
          headers: {
              'X-CSRF-TOKEN':$('meta[name="csrf-token"]').attr('content')
          },
          method: method,
          // dataType: 'json',
          data: data,
          success: function(data){
              callback(data);
          }
      });
  }
  
  function setTable(data,page){
    var table = $('#saTable').DataTable( {"order": [[ 0, "desc" ]]});
    table.clear().draw();
    var counter = 0;
    for (let index = 0; index < data.length; index++) {
      counter++;
      const element = data[index]; var status = '';
      var button = '<a href="'+page+'?id='+element._id+'" class="btn btn-primary">Edit</a>'
      if(element.status=='active'){ status = 'Active'; } else { status = 'InActive'; }
      var date = element.date;
      if(date==undefined){
        date = element.created_at;
      }
      table.row.add( [counter,element.title,date,status,button ] ).draw( false ); 
    }
  }
  
  function setBlog(data){
    $("#title").val(data.title);
    $("#id").val(data._id);
    $("#url").val(data.url);
    CKEDITOR.on('instanceReady', function() { 
      CKEDITOR.instances['editor'].setData(data.content);
    });
  
  
    // $("#date").val(data.date);
    // $("#date").val('11/11/1112');
    console.log(data);
    console.log(data.date);
    var setdate = moment.utc(data.date).format("DD/MM/YYYY");
    console.log(setdate);
  
    $("#date").val(setdate);
  
    for (let index = 0; index < data.tag.length; index++) {
      const element = data.tag[index];
      console.log(element);
      $('#'+element).prop('checked', true);
    }
    if(data.status=='active'){
      $('#active').prop('checked', true);
    } else if(data.status=='inactive') {
      $('#inactive').prop('checked', true);
    }
  }
  
  function setTag(data){
    $("#title").val(data.title);
    $("#id").val(data._id);
    $("#url").val(data.url);
    CKEDITOR.on('instanceReady', function() { 
      CKEDITOR.instances['editor'].setData(data.content);
    });
    if(data.status=='active'){
      $('#active').prop('checked', true);
    } else if(data.status=='inactive') {
      $('#inactive').prop('checked', true);
    }
  }
  var globalTags;
  function getTags(callback){
    httpCall("tag/list",{},'POST', function(result) {
      $("#dynamicTag").html('<label for="inputAddress2">Tags</label>');
      globalTags = result.data;
      var array = result.data;
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        $("#dynamicTag").append(
          `
          <div class="form-check form-check-inline">
            <input class="form-check-input" name="tag" type="checkbox" id="`+element.title+`" value="`+element._id+`">
            <label class="form-check-label" for="inlineCheckbox1">`+element.title+`</label>
          </div>
          `
        );
      }
      callback();
    });
  }
  
  function secretPage(){
    var heroUrl = 'https://sp-backend-private.herokuapp.com/getActivity';
    if (url.indexOf("secretDetails") > -1) { 
        length=100;table = heroUrl+"?type=detail";
    } else {
        length=50;table = heroUrl+"?type=plain";
    }
    $('#saTable').DataTable( {
        "processing": true,
        "stateSave": true,
  "pageLength": length,
        "serverSide": true,
        "ajax": table
    } );
  }
  
  function showAlert(type,message){
    $("#snackbar").html(message);
    $("#snackbar").attr('class', 'show');
    setTimeout(function(){
      $("#snackbar").attr('class', '');
    }, 3000);
  }
  
  
  
  });