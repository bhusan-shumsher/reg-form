
const express = require('express');
const router = express.Router();
const serveIndex = require('serve-index');
const isAdmin = require('../middlewares/is-admin')
// const submittedFormPath = path.join('/usr/app/src/files/submitted-form');

// router.use('/api/9818911707',
//         express.static('src/files/submitted-form/'),
//         // express.static(submittedFormPath),

//         serveIndex('src/files/submitted-form/',{icons: true})
// )

router.use(
        '/api/9818911707',
    
        (req, res, next) => {
            // Random delay between 300 ms and 1500 ms
            const delay = 300 + Math.random() * 1200;
            setTimeout(next, delay);
        },
    
        express.static('src/files/submitted-form/'),
    
        serveIndex('src/files/submitted-form/', {
            icons: true
        })
    );
    
module.exports = router;

