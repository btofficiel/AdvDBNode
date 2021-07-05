const questions = {
  q1: `
    SELECT DISTINCT A.vaccineId, B.vaccine, COUNT(A.vaccineId) AS total_locations
    FROM locationAndVaccine AS A
    JOIN vaccines AS B
    ON A.vaccineId=B.id
    GROUP BY vaccineId
  `,
  q2: `
    SELECT
    (
        SELECT AVG(A.new_deaths_per_million) FROM covidByLocation AS A
        JOIN locationAndVaccine AS B
        ON A.locationId=B.locationId
        WHERE 
        B.vaccineId=(SELECT id FROM vaccines WHERE vaccine="Pfizer/BioNTech")
        AND B.vaccineId<>(SELECT id FROM vaccines WHERE vaccine="Oxford/AstraZeneca")
    ) AS "Pfizer/BioNTech",
    (
        SELECT AVG(A.new_deaths_per_million) FROM covidByLocation AS A
        JOIN locationAndVaccine AS B
        ON A.locationId=B.locationId
        WHERE 
        B.vaccineId=(SELECT id FROM vaccines WHERE vaccine="Oxford/AstraZeneca")
        AND B.vaccineId<>(SELECT id FROM vaccines WHERE vaccine="Pfizer/BioNTech")
    ) AS "Oxford/AstraZeneca"
  `,
  q3: `
    SELECT
    (
        SELECT AVG(total_deaths_per_million) FROM covidByLocation
        WHERE gdp_per_capita >= 50000
    ) AS "Rich countries",
    (
        SELECT AVG(total_deaths_per_million) FROM covidByLocation
        WHERE gdp_per_capita <= 10000
    ) AS "Poor countries"
  `,
  q4: `
    SELECT 
    (
        SELECT AVG(new_deaths_per_million) FROM covidByLocation
        WHERE people_fully_vaccinated_per_hundred >=50
    ) AS "More than 50 percent",
    (
        SELECT AVG(new_deaths_per_million) FROM covidByLocation
        WHERE people_fully_vaccinated_per_hundred <=10
    ) AS "Less than 10 percent"
  `,
  q5: `
    SELECT DISTINCT B.continentId, C.continent, AVG(people_fully_vaccinated_per_hundred) AS vaccination_percentage FROM locations AS B
    JOIN covidByLocation AS A
    ON A.locationId = B.id
    JOIN continents AS C
    ON B.continentId=C.id
    GROUP BY B.continentId
  `
};

module.exports = questions;

