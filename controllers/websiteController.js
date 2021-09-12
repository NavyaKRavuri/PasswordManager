const website = require('../model/website');
const account = require('../model/account');

exports.list = (req, res) => {
    website.find({}, (err, websites) => {
        if (err) res.send(err);
        res.json(websites)
    });
}

exports.create = async (req, res) => {
    try {
        const { url, title } = req.body;
        var errors = {};
    
        if (!url) {
            Object.assign(errors, { url: "url field is required" });
        }
        if (!title) {
            Object.assign(errors, { title: "title field is required" });
        }
  
        const oldWebsite = await website.findOne({ url });
        if (oldWebsite) {
            Object.assign(errors, { url: "This website Already Exist!!" });
        }

        if(!(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/).test(url)) {
            Object.assign(errors, { url: "Please enter a valid URL" });
        }

        if (Object.keys(errors).length !== 0) {
            return res.status(422).json(errors);
        }

        const newWebsite = new website(req.body);
        newWebsite.save((err, website) => {
          if (err) return res.status(409).json(error);
          return res.status(201).json(website);
        });

    } catch (err) {
        return res.status(424).json(err);
    }
}

exports.edit = async (req, res) => {
    try {
        const { url, title } = req.body;
        var errors = {};
    
        if (!url) {
            Object.assign(errors, { url: "url field is required" });
        }
        if (!title) {
            Object.assign(errors, { title: "title field is required" });
        }
  
        const oldWebsite = await website.findOne({ url });
        
        if (oldWebsite['_id'] != req.params.websiteId) {
            Object.assign(errors, { url: "This website Already Exist!!" });
        }

        if(!(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/).test(url)) {
            Object.assign(errors, { url: "Please enter a valid URL" });
        }

        if (Object.keys(errors).length !== 0) {
            return res.status(422).json(errors);
        }

        website.updateOne({_id: req.params.websiteId}, req.body, function (err, website) {
            if (err) return res.status(409).json(error);
            return res.status(200).send("Website updated Successfully");
        });
    } catch (err) {
        return res.status(424).json(err);
    }
}

exports.show = (req, res) => {
    website.findById(req.params.websiteId, (err, website) => {
        if (err) return res.send(err);

        account.find({ _id: { $in: website['accountIds'] }},  function(err, accounts) {
            if (err) return res.send(err);

            return res.status(200).json({website: website, accounts: accounts});
        });
    });
}

exports.topWebsite = (req, res) => {
    website.find()
    .sort({'accountIds.length': -1})
    .limit(1)
    .exec(function(err, data) {
      if (err) return next(err);
      return res.status(200).send({data: data[0]});
    });
}

exports.delete = (req, res) => {
    website.deleteOne({ _id: req.params.websiteId }, err => {
        if (err) return res.send(err);
        return res.json({
            message: 'website successfully deleted',
            _id: req.params.websiteId
        });
    });
}

exports.addAccount = async (req, res) => {
    const {websiteId, accountId} = req.body;

    const oldWebsite = await getWebsite(websiteId);
    if(!websiteId || typeof(websiteId) !== 'string' || !oldWebsite) {
        return res.status(422).send("Invalid website");
    }

    const oldAccount = await getAccount(accountId);
    if(!accountId ||typeof(accountId) !== 'string'  || !oldAccount) {
        return res.status(422).send("Invalid Account");
    }

    const isAccountExist = oldWebsite.accountIds.some((accId) => accId == accountId)

    if(isAccountExist) {
        return res.status(422).send('Account already exists');
    } 

    oldWebsite.accountIds.push(accountId);
    oldWebsite.save();
    // website.updateOne(
    //     {
    //         _id: websiteId,
    //     }, {
    //         accountIds : oldWebsite.accountIds,
    //     }
    // );
    return res.status(200).send("account added successfully");
}

exports.removeAccount = async (req, res) => {
    const websiteId = req.params.websiteId;
    const accountId = req.params.accountId;

    const oldWebsite = await getWebsite(websiteId);
    if(!websiteId || typeof(websiteId) !== 'string' || !oldWebsite) {
        return res.status(422).send("Invalid website");
    }

    const oldAccount = await getAccount(accountId);
    if(!accountId ||typeof(accountId) !== 'string'  || !oldAccount) {
        return res.status(422).send("Invalid Account");
    }

    const isAccountExist = oldWebsite.accountIds.some((accId) => accId == accountId)

    if(!isAccountExist) {
        return res.status(422).send('This Account do not exist under this Website');
    } 

    var index =  oldWebsite.accountIds.map(item => {
        return item._id;
      }).indexOf(accountId);
      
    oldWebsite.accountIds.splice(index, 1);
    oldWebsite.save();

    return res.status(200).send('account dettached successfully!');
}

exports.accountsList = (req, res) => {
    let accounts = JSON.parse(req.params.accounts);
    account.find({ _id: { $nin: accounts }},  function(err, accounts) {
        if (err) return res.send(err);

        return res.status(200).json({accounts: accounts});
    });
}

exports.websitesCount = (req, res) => {
    website.count({}, function( err, count){
        if (err) return res.send(err);
        return res.status(200).json(count);
    })
}

exports.accountsCount = (req, res) => {
    account.count({}, function( err, count){
        if (err) return res.send(err);
        return res.status(200).json(count);
    })
}

const getWebsite = async (websiteId) => {
    const oldWebsite = await website.findOne({_id : websiteId });
    if (oldWebsite) {
        return oldWebsite;
    }
    return null;
}

const getAccount = async (accountId) => {
    const oldAccount = await account.findOne({_id : accountId });
    if (oldAccount) {
        return oldAccount;
    }
    return null;
}
