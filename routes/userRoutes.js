const authModules = require('../controllers/authController');
const websiteModules = require('../controllers/websiteController');

const auth = require("../middleware/auth");

module.exports = app => {
    app.route('/user/register').post(authModules.register);

    app.route('/user/login').post(authModules.login);

    app.use(auth);

    app.route('/websites')
        .get(websiteModules.list)
        .post(websiteModules.create)

    app.route('/website/:websiteId')
        .get(websiteModules.show)
        .post(websiteModules.edit)
        .delete(websiteModules.delete);

    app.route('/account').post(websiteModules.addAccount)
    app.route('/account/detach/:websiteId/:accountId').delete(websiteModules.removeAccount);

    app.route('/unlinkedaccounts/:accounts').get(websiteModules.accountsList);

    app.route('/websitescount').get(websiteModules.websitesCount);
    app.route('/accountscount').get(websiteModules.accountsCount);
    app.route('/topWebsite').get(websiteModules.topWebsite);
};
