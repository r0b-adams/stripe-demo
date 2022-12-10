const { storeItems } = require("./utils");

module.exports = {
  mapItems: (req, _res, next) => {
    const items = req.body.items.map(item => {
      const storeItem = storeItems.get(item.id);
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: storeItem.name,
          },
          unit_amount: storeItem.price,
        },
        quantity: item.qty,
      };
    });
    req.line_items = items;
    next();
  },
};
