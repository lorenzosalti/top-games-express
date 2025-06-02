const connect = require('../data/dbgames');


function orderIndex(req, res) {
  const sql = `SELECT 
    *
FROM
    orders`;

  connect.query(sql, (err, results) => {
    if (err) {
      console.err(err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(results)

  })
}

function orderShow(req, res) {
  const { id } = req.params

  const sql = `SELECT 
    *
FROM
    orders
    WHERE
    orders.id = ?`;

  connect.query(sql, [id], (err, results) => {
    if (err) {
      console.err(err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(results)

  })
}

function orderStore(req, res) {

  const { total_price, date, address_billing, city_billing, postal_code_billing, country_billing, region_billing } = req.body;

  const bilingData = [total_price, date, address_billing, city_billing, postal_code_billing, country_billing, region_billing]


  const sql = `
  INSERT INTO db_games.orders (total_price, date, address_billing, city_billing, postal_code_billing, country_billing, region_billing) 
  VALUES (?, ?, ?, ?, ?, ?, ?);`;

  connect.query(sql, bilingData, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.status(201).json(results)

  })
}


function customerStore(req, res) {

  const { name, surname, email, phone, id_order, address_shipping, city_shipping, postal_code_shipping, country_shipping, region_shipping } = req.body;

  const shippingData = [name, surname, email, phone, id_order, address_shipping, city_shipping, postal_code_shipping, country_shipping, region_shipping]


  const sql = `
  INSERT INTO db_games.customers (name, surname, email, phone, id_order, address_shipping, city_shipping, postal_code_shipping, country_shipping, region_shipping) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  connect.query(sql, shippingData, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.status(201).json({ messaage: 'Cliente registrato' })

  })
}


module.exports = { orderIndex, orderShow, orderStore, customerStore }
