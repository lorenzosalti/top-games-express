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
    INSERT INTO db_games.orders 
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

// function orderStore(req, res) {
//   const { total_price, date, address_billing, city_billing, postal_code_billing, country_billing, region_billing, email } = req.body;

//   const bilingData = [total_price, date, address_billing, city_billing, postal_code_billing, country_billing, region_billing];

//   const sql = `
//     INSERT INTO db_games.orders 
//     (total_price, date, address_billing, city_billing, postal_code_billing, country_billing, region_billing) 
//     VALUES (?, ?, ?, ?, ?, ?, ?);`;

//   connect.query(sql, bilingData, (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Errore nel salvataggio ordine' });
//     }

//     const orderId = results.insertId;

//     // Setup transporter nodemailer
//     const transporter = nodemailer.createTransport({
//       host: 'smtp.example.com',
//       port: 587,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       }
//     });

//     // Se ti arriva l'email del cliente, la usiamo per inviare la mail di conferma
//     if (!email) {
//       // Se manca l'email, rispondi subito
//       return res.status(201).json({ id_order: orderId });
//     }

//     const mailOptions = {
//       from: 'no-reply@example.com',
//       to: email,
//       subject: 'Conferma ordine BoRoad',
//       text: `Grazie per il tuo ordine! Il tuo numero d'ordine è ${orderId}.`
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error('Errore invio email:', error);
//         // Se vuoi puoi rispondere con un messaggio che segnala errore mail,
//         // ma l’ordine è comunque creato, quindi magari meglio rispondere OK comunque
//       }
//       // Risposta finale, ordine creato (email inviata o meno)
//       res.status(201).json({ id_order: orderId });
//     });
//   });
// }


// function customerStore(req, res) {
//   const { name, surname, email, phone, id_order, address_shipping, city_shipping, postal_code_shipping, country_shipping, region_shipping } = req.body;

//   if (!id_order) {
//     return res.status(400).json({ error: 'id_order mancante' });
//   }

//   const shippingData = [name, surname, email, phone, id_order, address_shipping, city_shipping, postal_code_shipping, country_shipping, region_shipping];

//   const sql = `
//     INSERT INTO db_games.customers 
//     (name, surname, email, phone, id_order, address_shipping, city_shipping, postal_code_shipping, country_shipping, region_shipping) 
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
//   `;

//   connect.query(sql, shippingData, (err, results) => {
//     if (err) {
//       console.error("Errore DB:", err);
//       return res.status(500).json({ error: 'Errore durante l\'inserimento del cliente' });
//     }
//     res.status(201).json({ message: 'Cliente registrato con successo' });
//   });
// }


function customerStore(req, res) {
  const { name, surname, email, phone, id_order, address_shipping, city_shipping, postal_code_shipping, country_shipping, region_shipping } = req.body;

  if (!id_order) {
    return res.status(400).json({ error: 'id_order mancante' });
  }

  const shippingData = [name, surname, email, phone, id_order, address_shipping, city_shipping, postal_code_shipping, country_shipping, region_shipping];

  const sql = `
    INSERT INTO db_games.customers 
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

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Conferma ordine BoRoad',
      text: `Ciao ${name}, grazie per il tuo ordine! Il tuo numero d'ordine è ${id_order}.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Errore invio email:', error);
        return res.status(201).json({ message: 'Cliente registrato, ma errore nell\'invio email.' });
      }

      res.status(201).json({ message: 'Cliente registrato con successo e email inviata.' });
    });
  });
}
module.exports = { orderIndex, orderShow, orderStore, customerStore }
