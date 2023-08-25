const fs = require('fs');
const xml2js = require('xml2js');

// Read the .mdj file
fs.readFile('test.mdj', 'utf-8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Parse the XML content
  xml2js.parseString(data, (parseErr, result) => {
    if (parseErr) {
      console.error('Error parsing XML:', parseErr);
      return;
    }

    // Extract elements from the parsed result
    const elements = result.model.packagedElement[0].packagedElement;

    // Create objects to store friends and their relationships
    const friends = {};

    // Iterate through elements to build friend relationships
    elements.forEach((element) => {
      const name = element.$.name;
      const friend = element.ownedAttribute[0].type[0].$.href;

      // Store friend relationships
      if (!friends[name]) {
        friends[name] = [];
      }
      friends[name].push(friend);
    });

    // Calculate coupling and cohesion based on friends
    const friendCount = Object.keys(friends).length;
    let totalCohesion = 0;
    let totalCoupling = 0;

    Object.keys(friends).forEach((person) => {
      totalCohesion += friends[person].length;
      friends[person].forEach((friend) => {
        if (friends[friend] && friends[friend].includes(person)) {
          totalCoupling++;
        }
      });
    });

    // Calculate average coupling and cohesion
    const avgCohesion = totalCohesion / friendCount;
    const avgCoupling = totalCoupling / friendCount;

    console.log('Average Cohesion:', avgCohesion);
    console.log('Average Coupling:', avgCoupling);
  });
});
