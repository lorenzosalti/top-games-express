const connect = require('../data/dbgames');
const nodemailer = require('nodemailer');

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

  const bilingData = [total_price, date, address_billing, city_billing, postal_code_billing, country_billing, region_billing];

  const sql = `
    INSERT INTO orders 
    (total_price, date, address_billing, city_billing, postal_code_billing, country_billing, region_billing) 
    VALUES (?, ?, ?, ?, ?, ?, ?);`;

  connect.query(sql, bilingData, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Errore nel salvataggio ordine' });
    }


    res.status(201).json({ id_order: results.insertId });
  });
}



function customerStore(req, res) {
  const { name, surname, email, phone, id_order, address_shipping, city_shipping, postal_code_shipping, country_shipping, region_shipping } = req.body;

  if (!id_order) {
    return res.status(400).json({ error: 'id_order mancante' });
  }

  const shippingData = [name, surname, email, phone, id_order, address_shipping, city_shipping, postal_code_shipping, country_shipping, region_shipping];

  const sql = `
    INSERT INTO customers 
    (name, surname, email, phone, id_order, address_shipping, city_shipping, postal_code_shipping, country_shipping, region_shipping) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  connect.query(sql, shippingData, (err, results) => {
    if (err) {
      console.error("Errore DB:", err);
      return res.status(500).json({ error: 'Errore durante l\'inserimento del cliente' });
    }

    // Configurazione nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const customersMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Conferma ordine Top Games',
      text: `Ciao ${name}, grazie per il tuo ordine! Il tuo numero d'ordine è ${id_order}.`
    };

    const sellerMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.SELLER_EMAIL,
      subject: `Nuovo ordine ricevuto - ID: ${id_order}`,
      text: `Hai ricevuto un nuovo ordine:\n
Cliente: ${name} ${surname}
Email: ${email}
Telefono: ${phone}

Indirizzo di spedizione:
${address_shipping}
${postal_code_shipping} ${city_shipping} (${region_shipping}, ${country_shipping})

ID Ordine: ${id_order}`
    };

    transporter.sendMail(customersMailOptions, (error, info) => {
      if (error) {
        console.error('Errore invio email:', error);
        return res.status(201).json({ message: 'Cliente registrato, ma errore nell\'invio email.' });
      }

      res.status(201).json({ message: 'Cliente registrato con successo e email inviata.' });
    });
    transporter.sendMail(sellerMailOptions, (sellerError, sellerInfo) => {
      if (sellerError) {
        console.error('Errore invio email:', sellerError);
        return res.status(201).json({ message: 'Cliente registrato, ma errore nell\'invio email.' });
      }

      res.status(201).json({ message: 'Cliente registrato con successo e email inviata.' });
    });
  });
}


async function sendEmailToSeller(req, res) {
  const { order, customer, games } = req.body;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let htmlContent = `
    <h2>Nuovo ordine ricevuto!</h2>
    <p><strong>Cliente:</strong> ${customer.name} ${customer.surname}</p>
    <p><strong>Email:</strong> ${customer.email}</p>
    <p><strong>Telefono:</strong> ${customer.phone}</p>
    <p><strong>Totale ordine:</strong> ${order.total_price} €</p>
    <h3>Prodotti:</h3>
    <ul>
      ${games.map(game => `<li>${game.title} x${game.quantity} - ${game.price}€</li>`).join("")}
    </ul>
  `;

  try {
    await transporter.sendMail({
      from: `"Top Games" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Nuovo ordine ricevuto!",
      html: htmlContent
    });
    res.status(200).json({ message: 'Email inviata al venditore con successo' });
  } catch (err) {
    console.error('Errore invio email al venditore:', err);
    res.status(500).json({ error: 'Errore nell\'invio email al venditore' });
  }
}
module.exports = { orderIndex, orderShow, orderStore, customerStore, sendEmailToSeller }
