module.exports = function (grunt) {

grunt.initConfig({
    connect: {
        server: {
            options: {
                keepalive: true,
                hostname: 'localhost',
                port: 8002
            }
        }
    }
});

grunt.loadNpmTasks('grunt-contrib-connect');

};