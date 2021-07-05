const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const fastify = require('fastify')({ logger: true });
const fastifyStatic = require('fastify-static');
const mysql = require('mysql2/promise');
const questions = require('./sql.js');

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'assets'),
  prefix: '/assets/', // optional: default '/'
})


//Create a connection creation promise
const connection = mysql.createConnection({
    host     : process.env.MYSQL_HOST,
    user     : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DB
});

//Add ability to render templates
fastify.register(require('point-of-view'), {
  engine: {
    ejs: require('ejs')
  }
})

// Declare a route
fastify.get('/', async (request, reply) => {
  try {
    let conn = await connection;

    //Question 1
    const [d1] = await conn.execute(questions.q1, []);

    let data1 = {
      labels: d1.map(t=>t.vaccine),
      data: d1.map(t=>t.total_locations)
    }

    //Question 2
    const [d2] = await conn.execute(questions.q2, []);

    let data2 = {
      labels: ["Pfizer/BioNTech", "Oxford/AstraZeneca"],
      data: [d2[0]["Pfizer/BioNTech"], d2[0]["Oxford/AstraZeneca"]]
    }

    //Question 3
    const [d3] = await conn.execute(questions.q3, []);

    let data3 = {
      labels: ["Rich Countries (GDP Per Capita >= $50k USD)", "Poor Countries (GDP Per Capita <= $10k USD"],
      data: [d3[0]["Rich countries"], d3[0]["Poor countries"]]
    }

    //Question 4
    const [d4] = await conn.execute(questions.q4, []);

    let data4 = {
      labels: ["Countries with more than 50 percent full vacinnation", "Countries with less than 10 percent full vaccination"],
      data: [d4[0]["More than 50 percent"], d4[0]["Less than 10 percent"]]
    }

    //Question 5
    const [d5] = await conn.execute(questions.q5, []);

    let data5 = {
      labels: d5.map(t=>t.continent),
      data: d5.map(t=>t.vaccination_percentage)
    }

    return reply.view('/views/index.ejs', {
      data1,
      data2,
      data3,
      data4,
      data5
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
