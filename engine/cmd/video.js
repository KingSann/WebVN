// Command video

webvn.use(['script', 'ui'], function (s, script, ui) {

var video = ui.get('video');

script.addCommand('video', {
    display: {
        type: Boolean,
        shortHand: 'd'
    },
    play: {
        type: Boolean,
        shortHand: 'pl'
    }
}, function (options, value) {

    if (options.display === true) {
        video.show();
    } else if (options.display === false) {
        video.hide();
    }

    if (options.play === true) {
        video.play();
    } else if (options.play === false) {
        video.stop();
    }

});

});