const connect = require('../data/dbgames');
const nodemailer = require('nodemailer');

function mailingStore(req, res) {
  const sql = `SELECT * FROM mailing_list;`;
  connect.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Errore server' });
    res.json(results);
  });
}

const subscribe = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email mancante' });
  }

  // Prima controlla se l’email è già presente
  const sqlCheck = 'SELECT * FROM mailing_list WHERE email = ?';
  connect.query(sqlCheck, [email], (checkErr, results) => {
    if (checkErr) {
      console.error('Errore controllo email:', checkErr);
      return res.status(500).json({ error: 'Errore server' });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: 'Email già iscritta' });
    }

    // Se non esiste, inserisce e manda la mail
    const sqlInsert = 'INSERT INTO mailing_list (email) VALUES (?)';
    connect.query(sqlInsert, [email], (insertErr) => {
      if (insertErr) {
        console.error('Errore inserimento:', insertErr);
        return res.status(500).json({ error: 'Errore server' });
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Grazie per esserti iscritto!',
        text: 'Grazie per esserti iscritto alla nostra newsletter.',
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Errore invio mail:', error);
          return res.status(500).json({ error: 'Errore invio mail' });
        }
        res.json({ message: 'Iscrizione avvenuta con successo' });
      });
    });
  });
};

module.exports = { mailingStore, subscribe };