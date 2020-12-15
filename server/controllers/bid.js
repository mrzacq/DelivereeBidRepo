const { Bid, Shipper, Post } = require("../models");

class BidController {
  static findAll(req, res, next) {
    Bid.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: {
        model: Post,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    })
      .then((bid) => {
        res.status(200).json(bid);
      })
      .catch((err) => next(err));
  }
  static getById(req, res, next) {
    const { id } = req.params;
    Bid.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: Post,
        },
        {
          model: Shipper,
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
      ],
      where: {
        id: id,
      },
    })
      .then((bid) => {
        if (bid.length == 0) throw { msg: "Bid not found", code: 404 };
        else {
          res.status(200).json(bid);
        }
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  }
  static createBid(req, res, next) {
    const { product_name, file, description, from, to } = req.body;
    Bid.create({
      product_name,
      product_picture: file,
      description,
      from,
      to,
      ShipperId: req.loggedIn.id,
    })
      .then((bid) => {
        res.status(201).json(bid);
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  }
  static updateBid(req, res, next) {
    const { id } = req.params;
    const { file, product_name, description, from, to } = req.body;
    Bid.update(
      { product_name, product_picture: file, description, from, to },
      {
        where: {
          id: id,
        },
      }
    )
      .then((bid) => {
        res.status(200).json({ msg: "Success update bid" });
      })
      .catch((err) => {
        next(err);
      });
  }

  static patchBid(req, res, next) {
    const { id } = req.params;
    const { status, TransporterId } = req.body;
    console.log(id, status, 'AWIWJDWSTAUTS')
    Bid.update(
      { status, TransporterId },
      {
        where: {
          id: id,
        },
      }
    )
      .then((bid) => {
        res.status(200).json({ msg: "Success patch bid" });
      })
      .catch((err) => {
        console.log(err, 'patch error')
        next(err);
      });
  }

  static deleteBid(req, res, next) {
    const { id } = req.params;
    Bid.destroy({
      where: {
        id: id,
      },
    })
      .then((bid) => {
        res.status(200).json({ msg: "Success delete bid" });
      })
      .catch((err) => next(err));
  }
}

module.exports = BidController;
