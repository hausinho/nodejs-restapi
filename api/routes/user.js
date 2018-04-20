const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const User = require('../models/user');

router.get("/", (req, res, next) => {
  User.find()
    .select("_id email")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        users: docs.map(doc => {
          return {
            email: doc.email,
            _id: doc._id,
          };
        })
      };
  
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post('/signup', (req, res, next) => {
  User.find({ email: req.body.email }).exec()
  .then(user => {
      if(user.length >= 1 ) {
        return res.status(409).json({
          message: 'Email exists already'
        })
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if(err) {
            return res.status(500).json({
              error:err
            })
          } else {
            const user = new User({
              _id: mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user.save()
            .then(result => {
              console.log(result);
              res.status(201).json({
                message: 'user created'
              })
            })
            .catch(err => {
              res.status(500).json({
                error: err
              });
            });  
          }  
        })
      }
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  });

});

router.delete('/:userId', (req, res, next) => {
    User.remove({_id: req.params.userId}).exec()
    .then( result => {
      res.status(200).json({
        message: 'User deleted!'
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
})

module.exports = router;