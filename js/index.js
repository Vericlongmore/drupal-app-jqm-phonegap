/***************************************************
 * Drupal Web Services            *
 ***************************************************/

/*jslint browser: true*/
/*global console, $*/

(function () {
    'use strict';
    
    /**
     * 处理请求发生的错误
     */
    
    function onError(jqXHR, textStatus, errorThrown) {
        // console.log(jqXHR);
        // console.log(textStatus);
        console.log(errorThrown);
    }
    
    /**
     * 删除内容
     */
    function deleteNode(nid) {
        $.ajax({
            url: 'http://localhost/drupal-7.28/myservice/user/token',
            type: 'POST',
            dataType: 'json',
            error: onError,
            success: function (CSRFToken) {
                $.ajax({
                    url: 'http://localhost/drupal-7.28/myservice/node/' + nid,
                    type: 'DELETE',
                    dataType: 'json',
                    error: onError,
                    beforeSend: function (request) {
                        request.setRequestHeader('X-CSRF-Token', CSRFToken.token);
                    },
                    success: function (data) {
                        console.log('成功删除了内容！');
                        $('body').pagecontainer('change', '#front');
                    }
                });
            }
        });
    }
     
    
    /**
     * 创建内容
     */
    function nodeCreate() {
        var nodeTitle = $('#node-create-title').val(),
            nodeBody = $('#node-create-body').val();
        $.ajax({
            url: 'http://localhost/drupal-7.28/myservice/user/token',
            type: 'POST',
            dataType: 'json',
            error: onError,
            success: function (CSRFToken) {
                $.ajax({
                    url: 'http://localhost/drupal-7.28/myservice/node/',
                    type: 'POST',
                    dataType: 'json',
                    data: 'node[type]=article&node[title]=' + nodeTitle + '&node[body][und][0][value]=' + nodeBody,
                    error: onError,
                    beforeSend: function (request) {
                        request.setRequestHeader('X-CSRF-Token', CSRFToken.token);
                    },
                    success: function (data) {
                        console.log('成功创建内容：' + data.title);
                        localStorage.setItem('currentNode', data.nid);
                        $('body').pagecontainer('change', '#node');
                    }
                });
            }
        });
    }
     
    /**
     * 编辑内容
     */
    
    function nodeEditSubmit(nodeTitle, nodeBody, nid) {
        $.ajax({
            url: 'http://localhost/drupal-7.28/myservice/user/token',
            type: 'POST',
            dataType: 'json',
            error: onError,
            success: function (CSRFToken) {
                $.ajax({
                    url: 'http://localhost/drupal-7.28/myservice/node/' + nid,
                    type: 'PUT',
                    dataType: 'json',
                    data: 'node[title]=' + nodeTitle + '&node[body][und][0][value]=' + nodeBody,
                    error: onError,
                    beforeSend: function (request) {
                        request.setRequestHeader('X-CSRF-Token', CSRFToken.token);
                    },
                    success: function (data) {
                        console.log('更新成功！');
                        $('body').pagecontainer('change', '#node');
                    }
                });
            }
        });
    }
    
    function editNode(nid) {
        $.ajax({
            url: 'http://localhost/drupal-7.28/myservice/node/' + nid,
            type: 'GET',
            dataType: 'json',
            error: onError,
            success: function (data) {
                $('#node-edit-title').val(data.title);
                $('#node-edit-body').val(data.body.und[0].value);
                console.log('正在编辑的内容是：' + data.title);
                $('#node-edit-submit').click(function () {
                    var nodeTitle = $('#node-edit-title').val(),
                        nodeBody = $('#node-edit-body').val();
                    nodeEditSubmit(nodeTitle, nodeBody, nid);
                });
            }
        });
    }
    
    /**
     * 请求用户登录
     */
    
    function userLogin() {
        var userName = $('#user-login-name').val(),
            userPassword = $('#user-login-password').val();
        $.ajax({
            url: 'http://localhost/drupal-7.28/myservice/user/token',
            type: 'POST',
            dataType: 'json',
            error: onError,
            success: function (CSRFToken) {
                $.ajax({
                    url: 'http://localhost/drupal-7.28/myservice/user/login',
                    type: 'POST',
                    dataType: 'json',
                    data: 'username=' + userName + '&password=' + userPassword,
                    error: onError,
                    beforeSend: function (request) {
                        request.setRequestHeader('X-CSRF-Token', CSRFToken.token);
                    },
                    success: function (data) {
                        console.log(data);
                        $('body').pagecontainer('change', '#user-profile');
                    }
                });
            }
        });
    }
    // 点击 登录 按钮时执行 userLogin()
    $('#user-login-submit').click(userLogin);
    
    /**
     * 请求退出当前登录
     */
    
    function userLogout() {
        $.ajax({
            url: 'http://localhost/drupal-7.28/myservice/user/token',
            type: 'POST',
            dataType: 'json',
            error: onError,
            success: function (CSRFToken) {
                $.ajax({
                    url: 'http://localhost/drupal-7.28/myservice/user/logout',
                    type: 'POST',
                    dataType: 'json',
                    error: onError,
                    beforeSend: function (request) {
                        request.setRequestHeader('X-CSRF-Token', CSRFToken.token);
                    },
                    success: function (data) {
                        console.log(data);
                        $('body').pagecontainer('change', '#front');
                    }
                });
            }
        });
    }
    // 点击登出按钮时执行 userLogout()
    $('.user-logout').click(userLogout);
    // 防止表单默认的行为
    $('form').on('submit', function (event) {
        event.preventDefault();
    });
    
    /**
     * 请求当前登录的用户相关信息
     */
    
    function getCurrentUser() {
        $.ajax({
            url: 'http://localhost/drupal-7.28/myservice/user/token',
            type: 'POST',
            dataType: 'json',
            error: onError,
            success: function (CSRFToken) {
                $.ajax({
                    url: 'http://localhost/drupal-7.28/myservice/system/connect',
                    type: 'POST',
                    dataType: 'json',
                    error: onError,
                    beforeSend: function (request) {
                        request.setRequestHeader('X-CSRF-Token', CSRFToken.token);
                    },
                    success: function (data) {
                        console.log(data);
                        
                        var uid = data.user.uid,
                            userName = null,
                            userCreated = null;
                        
                        if (uid === 0) {
                            // 如果是匿名用户，重定向到用户登录页面
                            $('body').pagecontainer('change', '#user-login');
                        } else {
                            userName = data.user.name;
                            userCreated = new Date(data.user.created * 1000);
                            $('#user-profile-body').html(
                                '<h3>' + userName + '</h3>' + '<p><strong>注册时间：</strong>' +
                                    userCreated.toLocaleDateString() + '</p>'
                            );
                        }
                        

                    }
                });
            }
        });
    }
    
    /**
     * 显示内容
     */
    
    function displayNode(nid) {
        $.ajax({
            url: 'http://localhost/drupal-7.28/myservice/node/' + nid,
            type: 'GET',
            dataType: 'json',
            error: onError,
            success: function (data) {
                console.log(data);
                $('.node-page-title').html(data.title);
                $('.node-page-body').html(data.body.und[0].safe_value);
                
                // 删除内容
                $('.node-delete').click(function () {
                    deleteNode(data.nid);
                });
            }
        });
    }
    

    /**
     * 载入内容列表
     */
    
    function loadArticleList() {
        $.ajax({
            url: 'http://localhost/drupal-7.28/article-list',
            type: 'GET',
            dataType: 'json',
            error: onError,
            success: function (data) {
                console.log(data);
                var i,
                    nodes = data.nodes,
                    articleList = document.getElementById('article-list');
                for (i = 0; i < nodes.length; i += 1) {
                    articleList.innerHTML +=
                        '<li><a href="#node" class="node-title" data-nid=' +
                        nodes[i].node.nid + '>' +
                        nodes[i].node.title +
                        '</a></li>';
                }
                
                // 刷新列表视图
                $('#article-list').listview('refresh');
                
                // 用所点击的节点 id 作为参数去调用 displayNode
                $('.node-title').click(function () {
                    var nid = $(this).attr('data-nid');
                    // displayNode(nid);
                    localStorage.setItem('currentNode', nid);
                });
                
            }
        });
    }
    
    /**
     * 当页面显示以后
     */
    
    $('body').on('pagecontainershow', function (event, ui) {
        // 默认的过渡效果设置为 'none'
        $.mobile.defaultPageTransition = 'none';
        // 获得当前活动的页面
        var currentPage = $('body').pagecontainer('getActivePage'),
            currentPageId = currentPage[0].id,
            currentNode = localStorage.getItem('currentNode');
        switch (currentPageId) {
        // 如果当前页面是 user-profile
        case 'user-profile':
            getCurrentUser();
            break;
        // 如果当前页面是 front
        case 'front':
            $('#article-list').html('');
            loadArticleList();
            break;
        // 如果当前页面是 node
        case 'node':
            if (currentNode) {
                displayNode(currentNode);
            }
            break;
        // 如果当前页面是 node-edit
        case 'node-edit':
            if (currentNode) {
                editNode(currentNode);
            }
            break;
        // 如果当前页面是 node-create
        case 'node-create':
            $('#node-create-submit').click(nodeCreate);
            break;
        }
    });
    
}());























