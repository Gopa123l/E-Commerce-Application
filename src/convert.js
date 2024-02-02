const fs = require('fs');
const Papa = require('papaparse');

const jsonResponse ='[{"id":"64ca0bfc8cbd3fcbeaa3c6ec","name":"anushka","email":"anushka123@gmail.com","password": "$2b$10$RDBaNWqh4/JUEXr9torWPuJMo6UOyWOOEziRlX0Q4UwejfW475PwG","order_id":[]},{"id":"64ca1b26312f1bf6f0462b74","name":"anushka","email":"anushka13@gmail.com","password": "$2b$10$RGoK7BzxkiCl8PS4VNj0ZODcdtIOuXH7nEx3JKUDgUt/tGbS3GLB.", "order_id":[]}]';

//Parse the json data
const jsonData = JSON.parse(jsonResponse);


//Convert json data to csv using papa parser
const csvData = Papa.unparse(jsonData);

// Write CSV data to a file
fs.writeFile('output.csv', csvData, (err) => {
    if (err) {
      console.error('Error writing CSV file:', err);
    } else {
      console.log('CSV file has been generated successfully.');
    }
  });

