const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const fastify = require('fastify')({ logger: true });
const mysql = require('mysql2/promise');
const questions = require('./sql.js');

const connection = mysql.createConnection({
    host     : process.env.MYSQL_HOST,
    user     : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DB
});

fastify.register(require('point-of-view'), {
  engine: {
    ejs: require('ejs')
  }
})

// Declare a route
fastify.get('/', async (request, reply) => {
  try {
    let conn = await connection;
    const [d1] = await conn.execute(questions.q1, []);

    let data1 = {
      labels: d1.map(t=>t.vaccine),
      data: d1.map(t=>t.total_locations)
    }

    const [d2] = await conn.execute(questions.q2, []);

    let data2 = {
      labels: ["Pfizer/BioNTech", "Oxford/AstraZeneca"],
      data: [d2[0]["Pfizer/BioNTech"], d2[0]["Oxford/AstraZeneca"]]
    }

    const [d3] = await conn.execute(questions.q3, []);

    let data3 = {
      labels: ["Rich Countries (GDP Per Capita >= $50k USD)", "Poor Countries (GDP Per Capita <= $10k USD"],
      data: [d3[0]["Rich countries"], d3[0]["Poor countries"]]
    }

    return reply.view('/views/index.ejs', {
      data1,
      data2,
      data3
    })
  } 
  catch {
    return "Error";
  }

});

// Run the server!
const start = async () => {
  try {
    await fastify.listen(8088);
  } catch (err) {
    fastify.log.error(err)
    process.exit(1);
  }
}
start();
