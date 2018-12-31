    // publish
    $('.save-button').on('click', function (e) {
        e.preventDefault();

        var data = {
            owner: $('#post-title').val(),
            uri: $('#post-title').val(),
            dbType: $('#post-title').val(),
            dbUser: $('#post-title').val(),
            dbPassword: $('#post-title').val(),
            dbTable: $('#post-title').val(),
            dbUrl: $('#post-title').val(),
            port: $('#post-title').val()
        };

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/app/add'
        }).done(function (data) {
            console.log(data);
            if (!data.ok) {
                console.log(data.error);
            } else {
                console.log(data)
            }
        });
    });