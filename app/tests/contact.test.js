function getContactsTest() {
    describe('get contacts', () => {
        it ('should return contacts', (done) => {

        });

        it ('should not return blocked user', (done) => {

        });

        it ('should not return user who blocked self', (done) => {

        })
    });
}

function deleteContactTest() {
    describe('delete contact', () => {
        it ('should delete contact and notify self', (done) => {

        });

        it ('should delete contact and notify other user', (done) => {

        });

        it ('should delete contact and delete all corresponding messages', (done) => {

        });
    });
}

module.exports = {
    getContactsTest,
    deleteContactTest
};