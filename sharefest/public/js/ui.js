

function updateList(fileInfo) {
//            $('#logo').hide();
    $('#box-text').html(listFiles(fileInfo));
    $('.dragdrop').css('opacity', 0.95);
    $('.dragdrop')[0].style.borderStyle = 'solid';
    $('.dragdrop')[0].style.borderWidth = '5px';
    $('.dragdrop')[0].style.borderColor = '#FFFFFF';
    $('#sharethis').css('opacity', 0.95);
    disableDrag();
    $('.dragdrop')[0].onclick = '';
}

function showLink() {
    $('#shareURLBox').show();
    $('#shareURLBox').text(document.location.href);
    $('#shareURLBox')[0].href = document.location.href;
//    $('#shareURLBox').popover({animation:true,placement:'left', delay:3000, trigger:'manual'});
//    $('#shareURLBox').popover('show')

}

function updateShareButtons() {
    var url = document.location.href;
//            var element = $('#addthis')[0];
//            $(element).attr('addthis:url',url);
    addthis.update('share', 'url', url);
    addthis.update('share', 'title', "Sharefest");
    addthis.url = url;
    addthis.toolbox(".addthis_toolbox");
    $('#addthis').show()
}

function onTextBoxClick(e) {
    e.stopPropagation();
}

var stupidMessage =
    ['Still loading',
        'Making some more coffee',
        'Watching my plants grow',
        'Trying to solve Goldbach problem',
        'Creating some random js code',
        'Waiting for something to happen',
        'Abracadabra',
        'Come on',
        'Wow you chose a big file',
        'zZzZZzZZz...',
        'Sorry!',
        'Sorry!!',
        'Sorry!!!',
        'Not sure if you want to share files, or stress test the platform',
        'Korim leze shagaat, korim leze tarefet',
        'You just wanna read all my nonsense, huh?',
        'OK, this is my last message for today. See ya!'
    ];

var firstUpLinkUpdate = true;
var firstDownLinkUpdate = true;
var downloadFinished = false;

var stupidMsgId;
function describeNonsense() {
    $('#box-text').text(stupidMessage[stupidMsgId++] + '...');
}


function showErrorAlert(Msg) {
    $("#notificationDiv").attr('class', 'alert alert-error');
    $("#notificationDiv").html(Msg).show();
}

function showWarningAlert(Msg) {
    $("#notificationDiv").attr('class', 'alert');
    $("#notificationDiv").html(Msg).show();
}

function showSuccessAlert(Msg) {
    $("#notificationDiv").attr('class', 'alert alert-success');
    $("#notificationDiv").html(Msg).show();
}

function showInfoAlert(Msg) {
    $("#notificationDiv").attr('class', 'alert alert-info');
    $("#notificationDiv").html(Msg).show();
}

function hideAlert() {
    $('.alert-error').hide();
}

var nonsenseId;
function startNonsense() {
    stupidMsgId = 0
    nonsenseId = setInterval(describeNonsense, 2000);
}

function stopNonsense() {
    clearInterval(nonsenseId);
}

function disableUI() {
    $('#files').remove();
    $('#box-info').remove();

}

function bytesToSize(bytes, precision) {
    var kilobyte = 1024;
    var megabyte = kilobyte * 1024;
    var gigabyte = megabyte * 1024;
    var terabyte = gigabyte * 1024;

    if ((bytes >= 0) && (bytes < kilobyte)) {
        return bytes + ' B';

    } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
        return (bytes / kilobyte).toFixed(precision) + ' KB';

    } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
        return (bytes / megabyte).toFixed(precision) + ' MB';

    } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
        return (bytes / gigabyte).toFixed(precision) + ' GB';

    } else if (bytes >= terabyte) {
        return (bytes / terabyte).toFixed(precision) + ' TB';

    } else {
        return bytes + ' B';
    }
}

radio('peer5_state_updated').subscribe([function (avg) {
    var prog = document.getElementById('progress');
    var progDiv = document.getElementById('progressbar');
    var per = document.getElementById('percent');
    var downRateDiv = document.getElementById('downRate');
    var bwPresenter = document.getElementById('bandwidthPresenter');
    var totalDownloadSpan = document.getElementById('box-text');

    //handle downlink div
    var perVal = (avg.Total_Recv_P2P / avg.size) * 100

    //we don't want to show downlond rate for origin (that will never actually download anything
    if (firstDownLinkUpdate && !sharefestClient.isOrigin()) {

        if (prog.hidden) {
            prog.hidden = false;
            progDiv.hidden = false;
        }

        firstDownLinkUpdate = false;
    }
    //update the values
    prog.value = perVal;
    per.textContent = Math.floor(perVal) + '%';
    downRateDiv.textContent = bytesToSize(avg.Avg_Recv_P2P, 1) + '/s';

    //handle the case where download is finished
    if (avg.transferFinished && !downloadFinished) {
        downloadFinished = true;
        userState.isSeeder = true;
        prog.hidden = true;

        totalDownloadSpan.hidden = false;
        totalDownloadSpan.textContent += ' was downloaded at ' + bytesToSize(avg.Total_Avg_Download) + '/s';

        bwPresenter.textContent = '';
        downRateDiv.textContent = '';
        progDiv.hidden = true;
        showLink();
        showSuccessAlert("File downloaded, thank you for Sharefesting! Please stay to help distribute the file");
    }


    //handle uplink div
    if (firstUpLinkUpdate && avg.Avg_Sent_P2P > 0) {
        var upRateDivParent = document.getElementById('uplinkRateSpan');
        if (upRateDivParent.hidden) {
            upRateDivParent.hidden = false;
        }

        firstUpLinkUpdate = false
    }
        var upRateDiv = document.getElementById('upRate');
        upRateDiv.textContent = bytesToSize(avg.Avg_Sent_P2P, 1) + '/s';
}, null]);

var state = null;
function fadeWhy() {
    if (state == 'why') {
        fadeText('');
        state = null;
    } else {
        state = 'why';
        fadeText(
            '<h3>Security</h3>Your files will not be stored anywhere. Further more, no one else besides the recipients ' +
                '(including Sharefest.me) will have access to the shared files. <a href="/faq">Solid</a> encryption is used to make it bulletproof.' +
                '<h3>Anonymous</h3>There is no need to sign up and give any information. We do not track our users. <a href="/privacy.html">Promise</a>.' +
                '<br><br><a href="javascript:fadeWhy2()">See More</a>'
        );
    }
}

function fadeWhy2() {
        fadeText(
                '<h3>Instant</h3>Because there is no need to wait for the file to be uploaded, you can begin receiving files the moment the sender begins uploading them.' +
                '<h3>Unlimited</h3>Send files at any size: large video, photo or the CAD you just made. (Coming soon - now limited to 250MB)' +
                '<br><br><a href="javascript:fadeWhy3()">Even More</a>'
        );

}


function fadeWhy3() {
    fadeText(
    '<h3>Free</h3>Sharefest is free of charge. Just like free beer!' +
    '<h3>Open Source</h3>There is an active <a href="http://github.com/peer5/sharefest">community</a> that keeps sharefest fresh with new ideas and less bugs. We encourage people to join, develop and build stuff on sharefest. ' +
    '<br><br><a href="javascript:fadeWhy4()">Cool, what else?</a>'
    );

}

function fadeWhy4() {
    fadeText(
        '<h3>Many-to-many</h3>Like Bittorrent, Sharefest is efficient in scenarios where the files is sent among many peers. The more peers, the stronger the <a href="/faq">swarm</a> gets. ' +
        '<h3>Fast on local networks</h3>Because the files transferred peer to peer, there is no need to use the Internet, which means less traffic on broadband, and more importantly, very fast speeds. Send files from your phone or to a co-worker in a breeze.' +
        '<br><br><a href="javascript:fadeWhy()">OK, enough.</a>&nbsp;&nbsp;<a href="mailto:sharefest@peer5.com">Need more? Contact us</a>'
    );

}


function fadeHow() {
    if (state == 'how') {
        fadeText('');
        state = null;
    } else {
        state = 'how';
        fadeText('Once you add a file on the left box, ' +
            'Sharefest creates a dynamic url that is used to get the file directly from your browser. ' +
            'Your browser will serve the file temporarily, as long as you keep the tab open. ' +
                'When users enter this unique url (<i>room</i>), they will start recieving pieces of the file and help others. Like BitTorrent, but in HTML5, using <a href="http://webrtc.org">WebRTC</a> Data Channels which make the bits fly P2P, serverless.<br><br>' +
//            'The users (peers) automagically ask each other for the remaining pieces until the file has been fully downloaded. ' +
//            'Peers will start helping each other, and becoming less reliant on the seeder. This is the nature of Sharefest\'s <i>mesh network</i>. ' +
//            'Behind the scenes, discovery, signaling and handshaking must be done.' +
            'The internals can be found in the <a href="/faq">FAQ</a> or on <a href="http://github.com/peer5/sharefest">GitHub</a>'
        );
    }
}

function fadeText(text) {
    $('#explainwhat').animate({'opacity':0}, 200,function () {
        $(this).html(text);
    }).animate({'opacity':1}, 100);
}
