function logoutTest() {
    describe('logout', () => {
        it ('should logout user and delete auth token', (done) => {

        });
    })
}

function blockTest() {
    describe('block user', () => {
        it ('should block user and notify self', (done) => {

        });

        it ('should block user and notify other user', (done) => {

        });
    });
}

function unblockTest() {
    describe('unblock user', () => {
        it ('should unblock user and notify self', (done) => {

        });

        it ('should unblock user and notify other user', (done) => {

        });
    });
}

function discoverySettingTest() {
    describe('change descovery setting', () => {
        it ('should change descovery setting and notify self', (done) => {

        });

        it ('should change descovery setting and broadcast', (done) => {

        });
    });
}

module.exports = {
    logoutTest,
    blockTest,
    unblockTest,
    discoverySettingTest
};