const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

let Sendmail = {};

Sendmail.success = (to, subject, msg) => {

  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      personalizations: [
        {
          to: [
            {
              email: to,
            },
          ],
          bcc: [
            {
              email: 'notifications@gitpay.me'
            }
          ],
          subject: 'Alguém tem interesse por uma tarefa que você cadastrou no Gitpay'
        },
      ],
      from: {
        email: 'tarefas@gitpay.me'
      },
      content: [
        {
          type: 'text/html',
          value: msg
        },
      ],
    },
  });

  sg.API(request)
    .then(response => {
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
    })
    .catch(error => {
      //error is an instance of SendGridError
      //The full response is attached to error.response
      console.log(error.response.body.errors);
      console.log(error.response.statusCode);
    });
}

Sendmail.error = (to, subject, msg) => {

  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      personalizations: [
        {
          to: [
            {
              email: to,
            },
          ],
          subject: subject
        },
      ],
      from: {
        email: 'tarefas@gitpay.me'
      },
      content: [
        {
          type: 'text/html',
          value: msg
        },
      ],
    },
  });

  sg.API(request)
    .then(response => {
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
    })
    .catch(error => {
      //error is an instance of SendGridError
      //The full response is attached to error.response
      console.log(error.response.statusCode);
    });
}

module.exports = Sendmail;


