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

async function orderStore(req, res) {
  const {
    customer_email,
    customer_name,
    customer_address,
    total_price,
    games
  } = req.body;

  const orderSql = `
    INSERT INTO orders (total_price, address_billing, created_at, date)
    VALUES (?, ?,NOW(), NOW())`;

  connect.query(orderSql, [total_price, customer_address], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Errore nel salvataggio dell\'ordine' });
    }

    const orderId = result.insertId;

    const orderGameSql = `
      INSERT INTO order_game (id_order, id_game, amount, quantity)
      VALUES ?`;

    const orderGamesValues = games.map(game => [
      orderId,
      game.game_id,
      game.price,
      game.quantity
    ]);

    connect.query(orderGameSql, [orderGamesValues], async (err2) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ error: 'Errore nel salvataggio dei giochi dell\'ordine' });
      }


      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const gameListHtml = games.map(game => {
        return `<li><strong>Gioco ID:</strong> ${game.game_id}, Quantità: ${game.quantity}, Prezzo: €${Number(game.price).toFixed(2)}</li>`;
      }).join("");

      const htmlContent = `
        <h2>Grazie per il tuo ordine, ${customer_name}!</h2>
        <p>Riepilogo ordine:</p>
        <ul>${gameListHtml}</ul>
        <p><strong>Totale:</strong> €${total_price.toFixed(2)}</p>
        <p><strong>Indirizzo:</strong> ${customer_address}</p>
      `;

      const adminMailContent = `
        <h2>Nuovo ordine ricevuto!</h2>
        <p><strong>Cliente:</strong> ${customer_name}</p>
        <p><strong>Email:</strong> ${customer_email}</p>
        <p><strong>Totale:</strong> €${total_price.toFixed(2)}</p>
        <p><strong>Indirizzo:</strong> ${customer_address}</p>
        <ul>${gameListHtml}</ul>
      `;

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: customer_email,
          subject: 'Conferma ordine Top Games',
          html: htmlContent,
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.SELLER_EMAIL,
          subject: 'Nuovo ordine ricevuto',
          html: adminMailContent,
        });

        return res.status(201).json({
          message: 'Ordine creato con successo!',
          orderId
        });

      } catch (emailErr) {
        console.error(emailErr);
        return res.status(500).json({ error: 'Ordine salvato ma errore nell\'invio delle email' });
      }
    });
  });
}

module.exports = { orderIndex, orderShow, orderStore }
