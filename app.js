import axios from 'axios';
import symbols from 'log-symbols';
import moment from 'moment';
import colors from 'colors';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import express from 'express';
import bodyParser from 'body-parser';

import apis from './apis';
const current = apis.reduce((acc, item) => {
  acc[item.id] = true;
  return acc;
}, {});

dotenv.config();

const getStatus = (name, id, url) => {
  return new Promise((resolve, reject) => {
    axios.get(url).then((response) => {
      if(response.status === 200) {
        current[id] = true;
        resolve({ name, status: 200 });
      } else {
        resolve({ name, status: response.status });
      }
    }).catch((error) => {
      if(error.response.status === 423) {
        return resolve({ name, status: 423});
      }

      resolve({ name, status: error.response.status });

      if(current[id]) {
        sendMail(name, error.response.status);
        sendSlackMessage(name, error.response.status);
        current[id] = false;
      }
    });
  });
}

setInterval(() => {
  axios.get('https://cf-status-check.herokuapp.com');

  const promises = [];
  apis.map((api) => {
    promises.push(getStatus(api.name, api.id, api.url));
  });

  Promise.all(promises)
  .then((results) => {
    //formatOutput(results);
  }).catch((error) => {
    console.log(error);
  })
}, process.env.INTERVAL_TIME);

function formatOutput(results) {
  const d = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
  const date = colors.cyan(d);

  console.log('---');
  results.forEach((result) => {
    const status = result.status === 200 ? symbols.success : symbols.error;
    const statusText = result.status === 200 ? 'Alive' : colors.red('Not available');
    console.log(`${status} ${date} - ${result.name} - ${statusText} - ${result.status}`);
  });
}

function sendMail(name, status) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: 'jmoran@nearbpo.com',
    from: { email: 'jmoran@corpfolder.com', name: 'Corpfolder status notifier' },
    subject: `${name} down.`,
    text: `Problema en ${name} detectado`,
    html: `Problema en ${name} detectado - API ${name} respondió con status ${status}`,
  };
  sgMail.send(msg);
}


function sendSlackMessage(name, status) {
  const url = 'https://slack.com/api/chat.postMessage';
  const msg = `Problema en ${name} detectado, respondió con status ${status}`;
  const body = { "channel": process.env.SLACK_CHANNEL, "text": msg };

  const options = {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SLACK_TOKEN}`
    },
    data: JSON.stringify(body),
    url,
  };
  axios(options).then((success) => {
    console.log(success);
  }).catch((error) => {
    console.log(error);
  })
}

function startupMessage() {
  const url = 'https://slack.com/api/chat.postMessage';
  const body = { "channel": "test", "text": "cf-status just went online" };

  const options = {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SLACK_TOKEN}`
    },
    data: JSON.stringify(body),
    url,
  };
  axios(options);
}
startupMessage();


console.log('App started');

const app = express();
app.use(bodyParser.json({ limit: '50mb'}));

app.get('/', (req, res) => {
  res.send({ status: 'ok', uptime: process.uptime() });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
